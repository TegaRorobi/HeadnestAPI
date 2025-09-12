const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = (userId, role, email) => {
  return jwt.sign(
    { id: userId, role, email }, // Add role and optionally email for quick access
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};