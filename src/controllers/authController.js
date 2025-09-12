const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const generateToken = require('../utils/jwt.js');

// =========================
// REGISTER
// =========================
exports.register = async (req, res) => {
  const { name, email, password, googleId, role, ...therapistData } = req.body;

  try {
    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email is already in use' });
    }

    // Hash password only if provided (non-Google signups)
    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const newUser = new User({
      name,
      email,
      password,
      googleId: googleId || null,
      role,
      ...therapistData,
    });

    await newUser.save();

    const token = generateToken(User._id, User.role, User.email);

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// =========================
// LOGIN (Unified)
// =========================
exports.login = async (req, res) => {
  const { email, password, googleId } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Handle Google login
    if (googleId) {
      if (!user.googleId) {
        return res.status(400).json({ msg: 'This account is not linked with Google' });
      }
      // Optionally verify googleId matches
      if (user.googleId !== googleId) {
        return res.status(400).json({ msg: 'Google ID does not match' });
      }
    } else {
      // Handle password login
      const isMatch = await bcrypt.compare(password, user.password || '');
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// =========================
// TOKEN REFRESH
// =========================
exports.tokenRefresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required.' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({
      message: `Invalid refresh token provided: ${err.message}. Please log in again.`,
    });
  }
};