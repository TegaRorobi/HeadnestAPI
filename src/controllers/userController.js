const User = require('../models/User');
const logger = require('../../logger');


exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: 'Your account has been deleted  ' });
  } catch (err) {
    logger.error(err)
    res.status(500).json({ message: 'Failed to delete account', error: err.message });
  }
};

// GET profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

// Update user settings
exports.updateSettings = async (req, res) => {
  try {
    const { notifications, language, theme } = req.body;

    // Find user and update settings
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      {
        $set: {
          "settings.notifications": notifications,
          "settings.language": language,
          "settings.theme": theme,
        }
      },
      { new: true } 
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "Settings updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};