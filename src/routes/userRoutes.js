const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {deleteAccount, } = require('../controllers/userController');



router.delete('/delete', auth, deleteAccount);


module.exports = router