const User = require("../models/User");
const logger = require("../../logger");
const Preferences = require("../models/Preferences");

exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: "Your account has been deleted  " });
  } catch (err) {
    logger.error(err);
    res
      .status(500)
      .json({ message: "Failed to delete account", error: err.message });
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
exports.addPreferences = async (req, res) => {
  try {
    const UserId = req.user.id;
    const experience = req.body.experience;
    const reminders = req.body.reminders;

    const response = await Preferences.create({
      userId: UserId,
      experience,
      reminders,
    });
    return res
      .status(201)
      .json({ message: "Preferences selected successfully", data: response });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const UserId = req.user.id;
    const response = await Preferences.findOne({ userId: UserId });
    return res
      .status(200)
      .json({ message: "Preferences returned successfully", data: response });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const UserId = req.user.id;
    const {experience, reminders } = req.body;
    const getPreference = await Preferences.findOne({ userId: UserId });
    if (!getPreference) {
      return res.status(404).json({ message: "User not found" });
    }

    if (experience) {
      getPreference.experience = experience;
    }
    if (reminders) {
      getPreference.reminders = reminders;
    }
    await getPreference.save();
    return res
      .status(200)
      .json({ message: "Update Successful", data: getPreference });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
