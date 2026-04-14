// backend/routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.patch("/read-all", protect, notificationController.markAllRead);
router.get("/", protect, notificationController.getNotifications);
router.patch("/:id/read", protect, notificationController.markRead);

module.exports = router;
