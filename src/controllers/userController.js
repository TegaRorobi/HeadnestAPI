const User = require('../models/User');
const logger = require('../../logger');
const Preferences = require("../models/Preferences");

exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: 'Your account has been deleted  ' });
  } catch (err) {
    logger.error(err)
    res.status(500).json({ message: 'Failed to delete account', error: err.message });
  }
};

exports.addPreferences = async(req, res) => {
  try {
      const UserId = req.user.id;
      const state_of_mind = req.body.state_of_mind;
      const experience = req.body.experience;
      const reminders = req.body.reminders;

      const response = await Preferences.create({
        userId: UserId,
        state_of_mind,
        experience,
        reminders,
      });
      return res.status(201).json({message: "Preferences selected successfully", data: response});
  }catch(error){
      return res.status(500).json({message: "Internal server error", error: error.message});
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
    const { state_of_mind, experience, reminders } = req.body;
    const getPreference = await Preferences.findOne({ userId: UserId });
    if (!getPreference) {
      return res.status(404).json({ message: "User not found" });
    }

    if (state_of_mind) {
      getPreference.state_of_mind = state_of_mind;
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

