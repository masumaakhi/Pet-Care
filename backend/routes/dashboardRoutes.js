// backend/routes/dashboardRoutes.js
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getAdminStats } = require("../controllers/dashboardController");

const router = express.Router();

router.use(protect); // Ensure user is logged in
router.get("/stats", getAdminStats); // Controller handles role check

module.exports = router;
