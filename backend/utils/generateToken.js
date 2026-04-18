//backend/utils/generateToken.js
const jwt = require("jsonwebtoken");

/**
 * Generate a JSON Web Token
 * @param {Object|String} user - The user object or user ID string
 * @returns {String} Signed JWT token
 */
const generateToken = (user) => {
  const payload = typeof user === 'string' ? { id: user } : {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token valid for 30 days
  });
};

module.exports = generateToken;
