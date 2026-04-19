// backend/routes/rescueRoutes.js
const express = require("express");
const router = express.Router();
const rescueController = require("../controllers/rescueController");
const volunteerController = require("../controllers/rescueVolunteerController");
const adminController = require("../controllers/rescueAdminController");
const { protect, optionalProtect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

/**
 * Static and collection routes MUST be registered before `/:id` so paths like
 * `/volunteer/nearby` and `/admin/all` are not captured as IDs.
 */

// Create (public with optional auth for reporter linkage)
router.post("/", optionalProtect, upload.single("image"), rescueController.createRescueRequest);
router.get("/my-requests", protect, rescueController.getMyRescues);
router.get("/listing", optionalProtect, adminController.getPublicRescueListing);
router.get("/public-alerts", optionalProtect, rescueController.getPublicUrgentAlerts);

// Volunteer
router.get("/volunteer/nearby", protect, authorize("volunteer", "admin"), volunteerController.getNearbyRescues);
router.get("/volunteer/history", protect, authorize("volunteer", "admin"), volunteerController.getVolunteerHistory);

// Admin
router.get("/admin/listing", protect, authorize("admin", "owner"), adminController.getRescueListing);
router.get("/admin/all", protect, authorize("admin"), adminController.getAllRescues);
router.get("/admin/analytics", protect, authorize("admin"), adminController.getAnalytics);
router.get("/admin/map", protect, authorize("admin"), adminController.getMapData);
router.get("/admin/duplicates", protect, authorize("admin"), adminController.getDuplicateReports);
router.get("/admin/notifications", protect, authorize("admin"), adminController.getNotificationLogs);
router.patch("/admin/duplicate/:id", protect, authorize("admin"), adminController.handleDuplicateAction);
router.patch("/admin/:id/assign", protect, authorize("admin"), adminController.manualAssign);

// User tracking
router.get("/:id/tracking", protect, rescueController.getRescueTracking);

// Volunteer actions on a specific rescue (specific PATCH paths before generic PATCH /:id)
router.post("/:id/accept", protect, authorize("volunteer", "admin"), volunteerController.acceptRescue);
router.patch("/:id/status", protect, authorize("volunteer", "admin"), volunteerController.updateStatus);
router.patch("/:id/live-location", protect, authorize("volunteer", "admin"), volunteerController.updateLiveLocation);

// Reporter CRUD: update / cancel own pending request
router.patch("/:id", protect, rescueController.updateMyRescueRequest);
router.delete("/:id", protect, rescueController.cancelMyRescueRequest);

router.get("/:id", protect, rescueController.getRescueDetails);

module.exports = router;
