// backend/controllers/rescueAdminController.js

const prisma = require("../prisma/prismaClient");
const { sendSuccess, sendError } = require("../utils/response");
const socketService = require("../services/SocketService");
const notificationService = require("../services/NotificationService");

/**
 * Controller for Administrative Rescue management
 */

/**
 * @desc    Get all rescue requests with advanced filters
 * @route   GET /api/admin/rescues
 */
const getAllRescues = async (req, res) => {
  try {
    const { status, priority, duplicate } = req.query;

    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (duplicate === "true") where.duplicateFlag = true;

    const rescues = await prisma.rescueRequest.findMany({
      where,
      include: {
        reporter: { select: { fullName: true, email: true } },
        assignedVolunteer: { select: { fullName: true, phone: true } },
      },
      orderBy: { createdAt: "desc" }
    });

    return sendSuccess(res, 200, "Admin: Rescues fetched", rescues);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Get duplicate reports for review
 * @route   GET /api/admin/rescues/duplicates
 */
const getDuplicateReports = async (req, res) => {
  try {
    const reports = await prisma.duplicateRescueReport.findMany({
      where: { status: "PENDING" },
      include: {
        mainRequest: true,
        duplicateRequest: true
      },
      orderBy: { confidenceScore: "desc" }
    });

    return sendSuccess(res, 200, "Duplicate reports fetched", reports);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Get analytics for rescue dashboard
 * @route   GET /api/admin/rescues/analytics
 */
const getAnalytics = async (req, res) => {
  try {
    const total = await prisma.rescueRequest.count();
    const active = await prisma.rescueRequest.count({
      where: { status: { in: ["PENDING", "ASSIGNED", "IN_PROGRESS", "PICKED", "VET"] } }
    });
    const completed = await prisma.rescueRequest.count({
      where: { status: { in: ["RESCUED", "SHELTER", "COMPLETED"] } }
    });

    // Group by status
    const statusCounts = await prisma.rescueRequest.groupBy({
      by: ["status"],
      _count: true
    });

    // Group by problemType
    const typeCounts = await prisma.rescueRequest.groupBy({
      by: ["problemType"],
      _count: true
    });

    return sendSuccess(res, 200, "Analytics fetched", {
      overview: { total, active, completed },
      statusCounts,
      typeCounts
    });
  } catch (error) {
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Get all map markers (Admin Map Page)
 * @route   GET /api/admin/rescues/map
 */
const getMapData = async (req, res) => {
  try {
    const rescues = await prisma.rescueRequest.findMany({
      where: { status: { not: "CANCELLED" } },
      select: {
        id: true,
        incidentLat: true,
        incidentLng: true,
        status: true,
        problemType: true,
        priority: true
      }
    });

    const volunteers = await prisma.volunteerProfile.findMany({
      where: { availability: true },
      select: {
        userId: true,
        lastLat: true,
        lastLng: true,
        user: { select: { fullName: true } }
      }
    });

    return sendSuccess(res, 200, "Map data fetched", { rescues, volunteers });
  } catch (error) {
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Manual assignment override
 * @route   PATCH /api/admin/rescues/:id/assign
 */
const manualAssign = async (req, res) => {
  try {
    const { id } = req.params;
    const { volunteerId } = req.body;

    if (!volunteerId) return sendError(res, 400, "volunteerId is required");

    const rescue = await prisma.rescueRequest.update({
      where: { id },
      data: {
        assignedVolunteerId: volunteerId,
        status: "ASSIGNED"
      }
    });

    await prisma.rescueAssignment.create({
      data: {
        rescueId: id,
        volunteerId,
        status: "PENDING"
      }
    });

    await notificationService.dispatch(volunteerId, {
      title: "New rescue assignment",
      message: `You have been assigned rescue ${id.slice(0, 8)}… Please review and accept.`,
      type: "ASSIGNMENT"
    });

    socketService.emitToUser(volunteerId, "rescue:new", { rescueId: id });
    socketService.emitToAdmin("rescue:status-updated", { rescueId: id, status: "ASSIGNED" });
    if (rescue.reporterId) {
      socketService.emitToUser(rescue.reporterId, "rescue:status-updated", {
        rescueId: id,
        status: "ASSIGNED",
      });
    }

    return sendSuccess(res, 200, "Manual assignment completed", rescue);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Get notification logs for rescues
 * @route   GET /api/admin/rescues/notifications
 */
const getNotificationLogs = async (req, res) => {
  try {
    const logs = await prisma.rescueNotification.findMany({
      where: { 
        OR: [
          { type: "ASSIGNMENT" },
          { type: "STATUS_UPDATE" },
          { title: { contains: "Rescue" } }
        ]
      },
      include: { user: { select: { fullName: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    return sendSuccess(res, 200, "Notification logs fetched", logs);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Rescue listing with volunteer actions and locations
 * @route   GET /api/rescues/admin/listing
 */
const getRescueListing = async (req, res) => {
  try {
    const { status, volunteerId, problemType, q } = req.query;

    const where = {};
    if (status) where.status = String(status).toUpperCase();
    if (problemType) where.problemType = problemType;
    if (volunteerId) where.assignedVolunteerId = volunteerId;
    if (q) {
      where.OR = [
        { id: { contains: q } },
        { incidentAddress: { contains: q, mode: "insensitive" } },
        { locationNote: { contains: q, mode: "insensitive" } },
      ];
    }

    const rescues = await prisma.rescueRequest.findMany({
      where,
      include: {
        reporter: { select: { id: true, fullName: true, email: true, phone: true } },
        assignedVolunteer: { select: { id: true, fullName: true, phone: true, email: true } },
        assignments: {
          orderBy: { assignedAt: "desc" },
          include: {
            volunteer: { select: { id: true, fullName: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const listing = rescues.map((item) => ({
      id: item.id,
      problemType: item.problemType,
      priority: item.priority,
      status: item.status,
      createdAt: item.createdAt,
      incidentAddress: item.incidentAddress || item.address || null,
      locationNote: item.locationNote || null,
      coordinates:
        item.incidentLat != null && item.incidentLng != null
          ? { lat: item.incidentLat, lng: item.incidentLng }
          : item.latitude != null && item.longitude != null
          ? { lat: item.latitude, lng: item.longitude }
          : null,
      reporter: item.reporter,
      assignedVolunteer: item.assignedVolunteer,
      volunteerActions: item.assignments.map((assignment) => ({
        assignmentId: assignment.id,
        volunteer: assignment.volunteer,
        status: assignment.status,
        assignedAt: assignment.assignedAt,
        respondedAt: assignment.respondedAt,
        notes: assignment.notes,
      })),
    }));

    return sendSuccess(res, 200, "Rescue listing fetched", listing);
  } catch (error) {
    console.error("getRescueListing", error);
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Public volunteer rescue listing with completed counts
 * @route   GET /api/rescues/listing
 */
const getPublicRescueListing = async (req, res) => {
  try {
    const { q } = req.query;
    const completedStatuses = ["RESCUED", "SHELTER", "COMPLETED"];

    const where = {
      assignedVolunteerId: { not: null },
      status: { in: completedStatuses },
    };

    if (q) {
      where.OR = [
        { problemType: { contains: q, mode: "insensitive" } },
        { incidentAddress: { contains: q, mode: "insensitive" } },
        { assignedVolunteer: { fullName: { contains: q, mode: "insensitive" } } },
      ];
    }

    const rescues = await prisma.rescueRequest.findMany({
      where,
      include: {
        assignedVolunteer: {
          select: { id: true, fullName: true, profilePicture: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const volunteerMap = new Map();

    for (const item of rescues) {
      if (!item.assignedVolunteer) continue;

      const volunteerId = item.assignedVolunteer.id;
      if (!volunteerMap.has(volunteerId)) {
        volunteerMap.set(volunteerId, {
          volunteer: item.assignedVolunteer,
          rescueCount: 0,
          rescuedPets: [],
        });
      }

      const entry = volunteerMap.get(volunteerId);
      entry.rescueCount += 1;
      entry.rescuedPets.push({
        rescueId: item.id,
        problemType: item.problemType,
        status: item.status,
        incidentAddress: item.incidentAddress || item.address || "Location not set",
        createdAt: item.createdAt,
      });
    }

    const listing = Array.from(volunteerMap.values())
      .map((entry) => ({
        ...entry,
        rescuedPets: entry.rescuedPets.slice(0, 5),
      }))
      .sort((a, b) => b.rescueCount - a.rescueCount);

    return sendSuccess(res, 200, "Public rescue listing fetched", listing);
  } catch (error) {
    console.error("getPublicRescueListing", error);
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Action on suspected duplicate (Confirm/Reject)
 * @route   PATCH /api/admin/rescues/duplicate/:id
 */
const handleDuplicateAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // "CONFIRMED" | "REJECTED"

    const report = await prisma.duplicateRescueReport.update({
      where: { id },
      data: { status: action }
    });

    if (action === "CONFIRMED") {
      // Mark the duplicate request as CANCELLED/DUPLICATE
      await prisma.rescueRequest.update({
        where: { id: report.duplicateRequestId },
        data: { status: "CANCELLED", duplicateFlag: true }
      });
    }

    return sendSuccess(res, 200, `Duplicate report ${action.toLowerCase()}`);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error");
  }
};

module.exports = {
  getAllRescues,
  getDuplicateReports,
  getAnalytics,
  getMapData,
  manualAssign,
  getRescueListing,
  getPublicRescueListing,
  getNotificationLogs,
  handleDuplicateAction
};
