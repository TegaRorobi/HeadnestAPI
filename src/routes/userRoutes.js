const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {deleteAccount, } = require('../controllers/userController');



router.delete('auth/delete', authMiddleware, deleteAccount);


module.exports = router
