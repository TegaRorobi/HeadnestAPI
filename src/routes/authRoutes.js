
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
router.post('/token/refresh', authController.tokenRefresh);

module.exports = router
