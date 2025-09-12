
const express = require('express');
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middlewares/validateMiddleware');

const router = express.Router();

// Registration route (with validation middleware)
router.post('/register', validateRegistration, authController.register);

// Login route
router.post('/login', validateLogin, authController.login);

router.post('/auth/token/refresh', authController.tokenRefresh);

module.exports = router
