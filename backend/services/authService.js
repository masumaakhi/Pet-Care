//backend/services/authService.js

const prisma = require("../prisma/prismaClient");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Hash a password
 * @param {String} password
 * @returns {String} Hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare password with hashed password
 * @param {String} enteredPassword
 * @param {String} userPassword
 * @returns {Boolean}
 */
const matchPassword = async (enteredPassword, userPassword) => {
  return await bcrypt.compare(enteredPassword, userPassword);
};

/**
 * Verify Google ID token
 * @param {String} idToken
 * @returns {Object} Google payload
 */
const verifyGoogleToken = async (idToken) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
};

/**
 * Find user by email
 * @param {String} email
 * @returns {Object} User
 */
const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Find user by ID
 * @param {String} id
 * @returns {Object} User
 */
const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      googleId: true,
      createdAt: true,
    },
  });
};

/**
 * Create a new user
 * @param {Object} userData
 * @returns {Object} User
 */
const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

/**
 * Update user password
 * @param {String} email
 * @param {String} newPassword
 * @returns {Object} Updated User
 */
const updatePassword = async (email, newPassword) => {
  const hashedPassword = await hashPassword(newPassword);
  return await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });
};

/**
 * Update user profile (name, email)
 * @param {String} id
 * @param {Object} data 
 * @returns {Object} Updated User
 */
const updateUserProfile = async (id, data) => {
  return await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      googleId: true,
      createdAt: true,
    },
  });
};

/**
 * Get all users
 * @returns {Array} List of all users
 */
const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      googleId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

module.exports = {
  hashPassword,
  matchPassword,
  verifyGoogleToken,
  getUserByEmail,
  getUserById,
  createUser,
  updatePassword,
  updateUserProfile,
  getAllUsers,
};
