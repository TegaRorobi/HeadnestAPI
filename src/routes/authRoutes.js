
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('auth/token/refresh', authController.tokenRefresh);

module.exports = router
