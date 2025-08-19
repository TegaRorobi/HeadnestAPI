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

