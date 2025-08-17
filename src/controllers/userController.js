const User = require('../models/User');

exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    res.json({ message: 'Your account has been deleted  ' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete account', error: err.message });
  }
};

