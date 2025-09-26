const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');



router.delete('/delete', authMiddleware, userController.deleteAccount);
// Get user profile
router.get('/profile', authMiddleware, userController.getProfile);

// Update user profile
router.put('/profile', authMiddleware, userController.updateProfile);

// Update user settings
router.put('/settings', authMiddleware, userController.updateSettings);


module.exports = router
