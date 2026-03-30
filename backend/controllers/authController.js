//backend/controllers/authController.js

const authService = require("../services/authService");
const generateToken = require("../utils/generateToken");
const { sendSuccess, sendError } = require("../utils/response");

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return sendError(res, 400, "Please provide all required fields");
    }

    const allowedRoles = ["user", "owner", "volunteer", "vet"];
    if (!allowedRoles.includes(role)) {
      return sendError(res, 400, "Invalid role provided");
    }

    // Check if user exists
    const userExists = await authService.getUserByEmail(email);

    if (userExists) {
      return sendError(res, 400, "User already exists");
    }

    // Hash password
    const hashedPassword = await authService.hashPassword(password);

    // Create user
    const user = await authService.createUser({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    if (user) {
      const token = generateToken(user.id);
      return sendSuccess(res, 201, "User registered successfully", {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token,
      });
    } else {
      return sendError(res, 400, "Invalid user data");
    }
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server error during registration");
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "Please provide email and password");
    }

    // Check for user
    const user = await authService.getUserByEmail(email);

    if (!user || !user.password) {
      return sendError(res, 401, "Invalid email or password");
    }

    // Match password
    const isMatch = await authService.matchPassword(password, user.password);

    if (isMatch) {
      const token = generateToken(user.id);
      return sendSuccess(res, 200, "Login successful", {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token,
      });
    } else {
      return sendError(res, 401, "Invalid email or password");
    }
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server error during login");
  }
};

/**
 * @desc    Google login
 * @route   POST /api/auth/google
 * @access  Public
 */
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return sendError(res, 400, "Google ID token is required");
    }

    // Verify token
    const payload = await authService.verifyGoogleToken(idToken);
    
    if (!payload) {
      return sendError(res, 401, "Invalid Google token");
    }

    const { email, name: fullName, sub: googleId } = payload;

    // Check if user exists
    let user = await authService.getUserByEmail(email);

    if (!user) {
      // Create new user for Google login
      user = await authService.createUser({
        fullName,
        email,
        googleId,
        role: "user", // Default role
      });
    } else if (!user.googleId) {
      // If user exists but hasn't linked Google, you could link it here (optional)
      // This is optional depending on requirements, but useful
    }

    const token = generateToken(user.id);
    
    return sendSuccess(res, 200, "Google login successful", {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return sendError(res, 401, "Google authentication failed");
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 400, "Please provide an email address");
    }

    const user = await authService.getUserByEmail(email);

    if (!user) {
      // For security, don't reveal that the user does not exist
      return sendSuccess(res, 200, "If your email is registered, you will receive password reset instructions");
    }

    // Usually you'd send an email here. As per instructions, no email sending.
    return sendSuccess(res, 200, "If your email is registered, you will receive password reset instructions");
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server error");
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return sendError(res, 400, "Please provide email and new password");
    }

    const user = await authService.getUserByEmail(email);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    await authService.updatePassword(email, newPassword);

    return sendSuccess(res, 200, "Password reset successfully");
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server error during password reset");
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    // req.user is set in authMiddleware
    if (req.user) {
      return sendSuccess(res, 200, "User fetched successfully", req.user);
    } else {
      return sendError(res, 404, "User not found");
    }
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server error fetching user profile");
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const { fullName, email, role, userId } = req.body;
    
    // Determine target user ID
    let targetUserId = req.user.id;
    
    if (userId && userId !== req.user.id) {
        if (req.user.role !== "admin" && req.user.role !== "owner") {
            return sendError(res, 403, "Not authorized to update other users");
        }
        targetUserId = userId;
    }

    // Get target user details
    const targetUser = await authService.getUserById(targetUserId);
    if (!targetUser) {
        return sendError(res, 404, "Target user not found");
    }

    // Check if email is being updated and if it belongs to someone else
    if (email && email !== targetUser.email) {
      const emailExists = await authService.getUserByEmail(email);
      if (emailExists) {
        return sendError(res, 400, "Email already in use");
      }
    }
    
    let roleToUpdate = targetUser.role;
    if (role && role !== targetUser.role) {
      if (req.user.role === "admin" || req.user.role === "owner") {
        const allowedRoles = ["user", "owner", "volunteer", "vet", "admin"];
        if (!allowedRoles.includes(role)) {
          return sendError(res, 400, "Invalid role provided");
        }
        roleToUpdate = role;
      } else {
        return sendError(res, 403, "Not authorized to update role");
      }
    }

    const updatedUser = await authService.updateUserProfile(targetUserId, {
      fullName: fullName || targetUser.fullName,
      email: email || targetUser.email,
      role: roleToUpdate
    });

    return sendSuccess(res, 200, "Profile updated successfully", updatedUser);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server error updating profile");
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/auth/users
 * @access  Private (Admin/Owner)
 */
const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "owner") {
      return sendError(res, 403, "Not authorized to access users");
    }
    const users = await authService.getAllUsers();
    return sendSuccess(res, 200, "Users fetched successfully", users);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server error fetching users");
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logoutUser = (req, res) => {
  // Since JWT is stateless, logout is handled client-side.
  return sendSuccess(res, 200, "Logged out successfully");
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  getAllUsers,
  logoutUser,
};
