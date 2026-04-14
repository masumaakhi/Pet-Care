// backend/controllers/rescueVolunteerController.js

const prisma = require("../prisma/prismaClient");
const { sendSuccess, sendError } = require("../utils/response");
const socketService = require("../services/SocketService");
const notificationService = require("../services/NotificationService");
const rescueService = require("../services/RescueService");

/**
 * Ensure volunteer has a profile row (needed for live location + matching).
 */
async function ensureVolunteerProfile(userId) {
  let profile = await prisma.volunteerProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: { id: true, fullName: true, phone: true, latitude: true, longitude: true },
      },
    },
  });
  if (!profile) {
    profile = await prisma.volunteerProfile.create({
      data: { userId },
      include: {
        user: {
          select: { id: true, fullName: true, phone: true, latitude: true, longitude: true },
        },
      },
    });
  }
  return profile;
}

/**
 * @desc    Get nearby pending rescue requests (and missions assigned to this volunteer)
 * @route   GET /api/rescues/volunteer/nearby
 */
const getNearbyRescues = async (req, res) => {
  try {
    let volLat;
    let volLng;
    let radiusKM = 10;

    if (req.user.role === "admin") {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { latitude: true, longitude: true },
      });
      volLat = user?.latitude;
      volLng = user?.longitude;
    } else {
      const profile = await ensureVolunteerProfile(req.user.id);
      volLat = profile.lastLat ?? profile.user?.latitude;
      volLng = profile.lastLng ?? profile.user?.longitude;
      radiusKM = profile.radiusKM ?? 10;
    }

    const candidates = await prisma.rescueRequest.findMany({
      where: {
        OR: [
          { status: "PENDING" },
          {
            assignedVolunteerId: req.user.id,
            status: { in: ["ASSIGNED", "IN_PROGRESS", "PICKED", "VET"] },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    const withMeta = candidates.map((r) => {
      const distanceKm = rescueService.getDistance(
        volLat,
        volLng,
        r.incidentLat,
        r.incidentLng
      );
      return { ...r, distanceKm: distanceKm === Infinity ? null : Number(distanceKm.toFixed(3)) };
    });

    const filtered = withMeta.filter((r) => {
      if (r.assignedVolunteerId === req.user.id) return true;
      if (r.status !== "PENDING") return false;
      if (volLat == null || volLng == null) return true;
      return (r.distanceKm ?? 9999) <= radiusKM;
    });

    filtered.sort((a, b) => {
      const da = a.distanceKm ?? 1e6;
      const db = b.distanceKm ?? 1e6;
      return da - db;
    });

    return sendSuccess(res, 200, "Nearby rescues fetched", filtered);
  } catch (error) {
    console.error("getNearbyRescues", error);
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Accept a rescue mission
 * @route   POST /api/rescues/:id/accept
 */
const acceptRescue = async (req, res) => {
  try {
    const { id } = req.params;

    const rescue = await prisma.$transaction(async (tx) => {
      const current = await tx.rescueRequest.findUnique({ where: { id } });

      if (!current) {
        throw new Error("Rescue not found");
      }

      if (current.status === "CANCELLED" || current.status === "COMPLETED") {
        throw new Error("Rescue mission is no longer available");
      }

      if (
        current.assignedVolunteerId &&
        current.assignedVolunteerId !== req.user.id
      ) {
        throw new Error("This mission is assigned to another volunteer");
      }

      const updated = await tx.rescueRequest.update({
        where: { id },
        data: {
          status: "IN_PROGRESS",
          assignedVolunteerId: req.user.id,
        },
      });

      await tx.rescueAssignment.updateMany({
        where: { rescueId: id, volunteerId: req.user.id },
        data: { status: "ACCEPTED", respondedAt: new Date() },
      });

      return updated;
    });

    if (rescue.reporterId) {
      await notificationService.dispatch(rescue.reporterId, {
        title: "Help is on the way!",
        message: `${req.user.fullName} has accepted your rescue request.`,
        type: "STATUS_UPDATE",
      });
      socketService.emitToUser(rescue.reporterId, "rescue:status-updated", {
        rescueId: id,
        status: "IN_PROGRESS",
      });
    }
    socketService.emitToAdmin("rescue:status-updated", { rescueId: id, status: "IN_PROGRESS" });
    socketService.emitToRoom(`rescue-${id}`, "rescue:status-updated", {
      rescueId: id,
      status: "IN_PROGRESS",
    });

    return sendSuccess(res, 200, "Mission accepted successfully", rescue);
  } catch (error) {
    return sendError(res, 400, error.message || "Could not accept mission");
  }
};

/**
 * @desc    Update live location of volunteer
 * @route   PATCH /api/rescues/:id/live-location
 */
const updateLiveLocation = async (req, res) => {
  try {
    const { id } = req.params;
    let lat = parseFloat(req.body.lat);
    let lng = parseFloat(req.body.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return sendError(res, 400, "Valid coordinates required");
    }

    const rescue = await prisma.rescueRequest.findUnique({ where: { id } });
    if (!rescue) return sendError(res, 404, "Rescue not found");

    if (rescue.assignedVolunteerId !== req.user.id && req.user.role !== "admin") {
      return sendError(res, 403, "Only the assigned volunteer can share location for this rescue");
    }

    const profile = await ensureVolunteerProfile(req.user.id);

    await prisma.volunteerProfile.update({
      where: { userId: req.user.id },
      data: { lastLat: lat, lastLng: lng, lastActive: new Date() },
    });

    await prisma.volunteerLiveLocation.create({
      data: {
        volunteerId: profile.id,
        latitude: lat,
        longitude: lng,
      },
    });

    const distanceKm = rescueService.getDistance(
      lat,
      lng,
      rescue.incidentLat,
      rescue.incidentLng
    );
    const etaMinutes = rescueService.calculateETA(distanceKm);

    const payload = {
      rescueId: id,
      lat,
      lng,
      etaMinutes,
    };

    socketService.emitToRoom(`rescue-${id}`, "rescue:location-updated", payload);
    socketService.emitToRoom(`rescue-${id}`, "rescue:eta-updated", payload);

    if (rescue.reporterId) {
      socketService.emitToUser(rescue.reporterId, "rescue:location-updated", payload);
      socketService.emitToUser(rescue.reporterId, "rescue:eta-updated", payload);
    }
    socketService.emitToAdmin("rescue:location-updated", payload);

    return sendSuccess(res, 200, "Location updated", { etaMinutes });
  } catch (error) {
    console.error("updateLiveLocation", error);
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Update mission status
 * @route   PATCH /api/rescues/:id/status
 */
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) return sendError(res, 400, "Status is required");

    const existing = await prisma.rescueRequest.findUnique({ where: { id } });
    if (!existing) return sendError(res, 404, "Rescue not found");

    if (
      existing.assignedVolunteerId !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return sendError(res, 403, "Not authorized to update this rescue");
    }

    const rescue = await prisma.rescueRequest.update({
      where: { id },
      data: { status },
    });

    if (note && existing.assignedVolunteerId) {
      await prisma.rescueAssignment.updateMany({
        where: { rescueId: id, volunteerId: existing.assignedVolunteerId },
        data: { notes: note },
      });
    }

    if (rescue.reporterId) {
      await notificationService.dispatch(rescue.reporterId, {
        title: "Rescue status updated",
        message: `Status is now ${status.replace(/_/g, " ")}.`,
        type: "STATUS_UPDATE",
      });
      socketService.emitToUser(rescue.reporterId, "rescue:status-updated", {
        rescueId: id,
        status,
      });
    }
    socketService.emitToAdmin("rescue:status-updated", { rescueId: id, status });
    socketService.emitToRoom(`rescue-${id}`, "rescue:status-updated", {
      rescueId: id,
      status,
    });

    return sendSuccess(res, 200, `Mission updated to ${status}`, rescue);
  } catch (error) {
    console.error("updateStatus", error);
    return sendError(res, 500, "Internal Server Error");
  }
};

const getVolunteerHistory = async (req, res) => {
  try {
    const rescues = await prisma.rescueRequest.findMany({
      where: { assignedVolunteerId: req.user.id },
      orderBy: { updatedAt: "desc" },
    });

    return sendSuccess(res, 200, "Volunteer history fetched", rescues);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error");
  }
};

module.exports = {
  getNearbyRescues,
  acceptRescue,
  updateLiveLocation,
  updateStatus,
  getVolunteerHistory,
};
