//backend/utils/generateToken.js
const jwt = require("jsonwebtoken");

/**
 * Generate a JSON Web Token
 * @param {String} userId - The user's ID
 * @returns {String} Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token valid for 30 days
  });
};

module.exports = generateToken;
