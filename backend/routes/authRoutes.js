//backend/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  getAllUsers,
  logoutUser,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logoutUser);

// Private routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.get("/users", protect, getAllUsers);

module.exports = router;
