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
  getUserById,
  logoutUser,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logoutUser);

// Private routes
router.get("/me", protect, getMe);
router.put("/profile", protect, upload.single("profilePicture"), updateProfile);
router.get("/users", protect, getAllUsers);
router.get("/users/:id", protect, getUserById);

module.exports = router;
