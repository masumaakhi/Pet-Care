// backend/controllers/rescueController.js

const prisma = require("../prisma/prismaClient");
const { sendSuccess, sendError } = require("../utils/response");
const rescueService = require("../services/RescueService");
const notificationService = require("../services/NotificationService");
const socketService = require("../services/SocketService");
const { getUploadedFileUrl } = require("../utils/uploadUrl");

/**
 * Controller for User-facing Rescue actions
 */

/**
 * @desc    Submit a new rescue request
 * @route   POST /api/rescues
 */
const createRescueRequest = async (req, res) => {
  try {
    const {
      problemType,
      priority,
      description,
      incidentAddress,
      incidentLat,
      incidentLng,
      locationNote,
      petCondition,
    } = req.body;

    if (!problemType || !priority || !description || !incidentAddress || !incidentLat || !incidentLng) {
      return sendError(res, 400, "Please provide all required fields including location");
    }

    let photoUrl = req.body.photoUrl;
    if (req.file) {
      const fallbackPhotoUrl = req.file.filename ? `/uploads/rescues/${req.file.filename}` : null;
      photoUrl = getUploadedFileUrl(req.file, fallbackPhotoUrl);
    }

    const latN = parseFloat(incidentLat);
    const lngN = parseFloat(incidentLng);
    if (!Number.isFinite(latN) || !Number.isFinite(lngN)) {
      return sendError(res, 400, "Invalid coordinates");
    }

    let fullDescription = String(description).trim();
    if (petCondition && String(petCondition).trim()) {
      fullDescription = `Pet condition: ${String(petCondition).trim()}\n\n${fullDescription}`;
    }

    const dupCheck = await rescueService.detectDuplicates({
      incidentLat: latN,
      incidentLng: lngN,
      problemType,
      photoUrl,
    });

    const rescueRequest = await prisma.rescueRequest.create({
      data: {
        problemType,
        priority: priority.toUpperCase(),
        description: fullDescription,
        incidentAddress,
        incidentLat: latN,
        incidentLng: lngN,
        locationNote,
        photoUrl,
        reporterId: req.user ? req.user.id : null,
        duplicateFlag: dupCheck.isDuplicate,
        duplicateScore: dupCheck.score,
      },
    });

    if (dupCheck.isDuplicate) {
      await prisma.duplicateRescueReport.create({
        data: {
          mainRequestId: dupCheck.mainRequestId,
          duplicateRequestId: rescueRequest.id,
          confidenceScore: dupCheck.score,
        },
      });
      socketService.emitToAdmin("rescue:duplicate-flagged", { rescueId: rescueRequest.id });
    }

    const nearbyVolunteers = await rescueService.findNearbyVolunteers(latN, lngN);
    const nearbyClinics = await rescueService.findNearbyClinics(latN, lngN);

    if (!dupCheck.isDuplicate) {
      for (const clinic of nearbyClinics.slice(0, 10)) {
        await notificationService.dispatch(clinic.id, {
          title: "Nearby emergency rescue",
          message: `A rescue was reported ~${Number(clinic.distance.toFixed(1))} km away (${problemType}).`,
          type: "SYSTEM",
        });
      }
    }

    let assignedVolunteerId = null;
    if (nearbyVolunteers.length > 0 && !dupCheck.isDuplicate) {
      await rescueService.assignNextVolunteer(rescueRequest.id);

      const volunteer = nearbyVolunteers[0];
      assignedVolunteerId = volunteer.userId;
      await notificationService.dispatch(volunteer.userId, {
        title: "🚨 New Rescue Mission!",
        message: `An emergency alert was reported near your location.`,
        type: "ASSIGNMENT",
      });
      socketService.emitToUser(volunteer.userId, "rescue:new", { rescueId: rescueRequest.id });
    } else if (!dupCheck.isDuplicate) {
      socketService.emitToAdmin("rescue:unassigned", { rescueId: rescueRequest.id });
    }

    const alternativeVolunteers = nearbyVolunteers.slice(1, 6).map((v) => ({
      userId: v.userId,
      fullName: v.user?.fullName,
      distanceKm: v.distance === Infinity ? null : Number(v.distance.toFixed(2)),
    }));

    return sendSuccess(res, 201, "Rescue request submitted successfully", {
      ...rescueRequest,
      routing: {
        assignedVolunteerId,
        alternativeVolunteers,
        clinicsNotified: dupCheck.isDuplicate ? 0 : Math.min(nearbyClinics.length, 10),
      },
    });
  } catch (error) {
    console.error("Create Rescue Request Error:", error);
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Get user's own rescue requests
 * @route   GET /api/rescues/my-requests
 */
const getMyRescues = async (req, res) => {
  try {
    const rescues = await prisma.rescueRequest.findMany({
      where: { reporterId: req.user.id },
      include: {
        assignedVolunteer: {
          select: { fullName: true, phone: true }
        },
        assignments: {
          orderBy: { assignedAt: "desc" },
          take: 1
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(res, 200, "My rescues fetched successfully", rescues);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Get tracking info for a specific rescue
 * @route   GET /api/rescues/:id/tracking
 */
const getRescueTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const rescue = await prisma.rescueRequest.findUnique({
      where: { id },
      include: {
        assignedVolunteer: {
          include: { volunteerProfile: true },
        },
      },
    });

    if (!rescue) return sendError(res, 404, "Rescue alert not found");

    const profile = rescue.assignedVolunteer?.volunteerProfile;
    const volLat =
      profile?.lastLat ?? rescue.assignedVolunteer?.latitude ?? null;
    const volLng =
      profile?.lastLng ?? rescue.assignedVolunteer?.longitude ?? null;

    let trackingData = {
      rescueId: id,
      status: rescue.status,
      volunteer: null,
      eta: null,
    };

    if (rescue.assignedVolunteer && volLat != null && volLng != null) {
      const distance = rescueService.getDistance(
        rescue.incidentLat,
        rescue.incidentLng,
        volLat,
        volLng
      );

      trackingData.volunteer = {
        fullName: rescue.assignedVolunteer.fullName,
        phone: rescue.assignedVolunteer.phone,
        location: { lat: volLat, lng: volLng },
      };
      trackingData.eta = rescueService.calculateETA(distance);
    } else if (rescue.assignedVolunteer) {
      trackingData.volunteer = {
        fullName: rescue.assignedVolunteer.fullName,
        phone: rescue.assignedVolunteer.phone,
        location: null,
      };
    }

    return sendSuccess(res, 200, "Tracking data fetched", trackingData);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Get rescue details
 * @route   GET /api/rescues/:id
 */
const getRescueDetails = async (req, res) => {
  try {
    const rescue = await prisma.rescueRequest.findUnique({
      where: { id: req.params.id },
      include: {
        reporter: { select: { fullName: true, phone: true, email: true } },
        assignedVolunteer: { select: { fullName: true, phone: true } },
        assignments: {
          orderBy: { assignedAt: "desc" },
          include: { volunteer: { select: { id: true, fullName: true } } },
        },
      },
    });

    if (!rescue) return sendError(res, 404, "Rescue not found");
    return sendSuccess(res, 200, "Rescue details fetched", rescue);
  } catch (error) {
    console.error("getRescueDetails:", error);
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Update current user's pending rescue request
 * @route   PATCH /api/rescues/:id
 */
const updateMyRescueRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      problemType,
      priority,
      description,
      incidentAddress,
      incidentLat,
      incidentLng,
      locationNote,
    } = req.body;

    const rescue = await prisma.rescueRequest.findUnique({ where: { id } });
    if (!rescue) return sendError(res, 404, "Rescue not found");
    if (!rescue.reporterId || rescue.reporterId !== req.user.id) {
      return sendError(res, 403, "You can only update your own rescue requests");
    }
    if (rescue.status !== "PENDING") {
      return sendError(res, 400, "Only pending requests can be updated");
    }

    const data = {};
    if (problemType !== undefined) data.problemType = problemType;
    if (priority !== undefined) data.priority = String(priority).toUpperCase();
    if (description !== undefined) data.description = description;
    if (incidentAddress !== undefined) data.incidentAddress = incidentAddress;
    if (incidentLat !== undefined) data.incidentLat = parseFloat(incidentLat);
    if (incidentLng !== undefined) data.incidentLng = parseFloat(incidentLng);
    if (locationNote !== undefined) data.locationNote = locationNote;

    if (Object.keys(data).length === 0) {
      return sendError(res, 400, "No fields to update");
    }

    const updated = await prisma.rescueRequest.update({
      where: { id },
      data,
      include: {
        assignedVolunteer: { select: { fullName: true, phone: true } },
        assignments: {
          orderBy: { assignedAt: "desc" },
          take: 1,
        },
      },
    });

    return sendSuccess(res, 200, "Rescue request updated", updated);
  } catch (error) {
    console.error("Update Rescue Error:", error);
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Cancel current user's pending rescue request
 * @route   DELETE /api/rescues/:id
 */
const cancelMyRescueRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const rescue = await prisma.rescueRequest.findUnique({ where: { id } });
    if (!rescue) return sendError(res, 404, "Rescue not found");
    if (!rescue.reporterId || rescue.reporterId !== req.user.id) {
      return sendError(res, 403, "You can only cancel your own rescue requests");
    }
    if (rescue.status !== "PENDING") {
      return sendError(res, 400, "Only pending requests can be cancelled");
    }

    const updated = await prisma.rescueRequest.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return sendSuccess(res, 200, "Rescue request cancelled", updated);
  } catch (error) {
    console.error("Cancel Rescue Error:", error);
    return sendError(res, 500, "Internal Server Error");
  }
};

module.exports = {
  createRescueRequest,
  getMyRescues,
  getRescueTracking,
  getRescueDetails,
  updateMyRescueRequest,
  cancelMyRescueRequest,
};
