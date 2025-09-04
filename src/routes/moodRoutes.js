const express = require('express');
const router = express.Router();
const { submitMoodCheckin, getMoodProgress } = require('../controllers/moodController');
const authMiddleware = require('../middlewares/authMiddleware')


router.post('/mood-checkin', authMiddleware, submitMoodCheckin);
router.get('/mood-checkin/progress', authMiddleware, getMoodProgress);

module.exports = router;