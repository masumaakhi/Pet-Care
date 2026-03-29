//backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/response");
const prisma = require("../prisma/prismaClient");

/**
 * Middleware to protect routes via JWT
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach to request
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          googleId: true,
          createdAt: true,
        },
      });

      if (!req.user) {
        return sendError(res, 401, "Not authorized, user not found");
      }

      next();
    } catch (error) {
      console.error(error);
      return sendError(res, 401, "Not authorized, token failed");
    }
  }

  if (!token) {
    return sendError(res, 401, "Not authorized, no token");
  }
};

/**
 * Middleware to restrict access to specific roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 403, "Not authorized, insufficient permissions");
    }
    next();
  };
};

module.exports = { protect, authorize };
