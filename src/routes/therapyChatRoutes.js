const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const sessionAuthMiddleware = require('../middlewares/sessionAuthMiddleware');
const { accessChatroom, sendMessage, exitChatroom, clearExpiredMessages, sendNotification } = require('../controllers/therapyChatController');


router.get('/appointments/:id/chat', authMiddleware, sessionAuthMiddleware, accessChatroom);
router.post('/therapy/chat/send', authMiddleware, sessionAuthMiddleware, sendMessage);
router.post('/therapy/chat/exit', authMiddleware, sessionAuthMiddleware, exitChatroom);
router.delete('/therapy/chat/history', clearExpiredMessages);
router.post('/therapy/chat/notify', authMiddleware, sessionAuthMiddleware, sendNotification);

module.exports = router;