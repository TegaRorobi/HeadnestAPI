const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {deleteAccount, } = require('../controllers/userController');



router.delete('/me', auth, deleteAccount);