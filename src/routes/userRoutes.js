const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
    deleteAccount,
    getProfile,
    updateProfile,
    updateSettings,
    addPreferences,
    getPreferences,
    updatePreferences,
  } = require("../controllers/userController");


//router.delete("/delete", auth, deleteAccount);
router.delete('/delete', authMiddleware, deleteAccount);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/settings', authMiddleware, updateSettings);
router.post("/preferences", authMiddleware, addPreferences);
router.get("/preferences", authMiddleware, getPreferences);
router.put("/preferences", authMiddleware, updatePreferences);

module.exports = router;
