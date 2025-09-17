const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getCommunities, joinCommunity, leaveCommunity } = require('../controllers/communityController');


router.get('/community', authMiddleware, getCommunities);
router.post('/community/join/:id', authMiddleware, joinCommunity);
router.post('/community/leave/:id', authMiddleware, leaveCommunity);

module.exports = router;