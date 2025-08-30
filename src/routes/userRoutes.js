const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {deleteAccount, addPreferences, getPreferences, updatePreferences} = require('../controllers/userController');


router.delete('/delete', auth, deleteAccount);
router.post("/preferences", auth, addPreferences);
router.get("/preferences", auth, getPreferences);
router.put("/preferences", auth, updatePreferences)


module.exports = router
