// backend/routes/dashboardRoutes.js
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getAdminStats, getAdminSummary } = require("../controllers/dashboardController");

const router = express.Router();

router.use(protect); // Ensure user is logged in
router.get("/stats", getAdminStats); // Controller handles role check
router.get("/admin-summary", getAdminSummary);

module.exports = router;
