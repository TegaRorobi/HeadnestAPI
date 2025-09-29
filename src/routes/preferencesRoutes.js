const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {addPreferences, getPreferences, updatePreferences} = require("../controllers/preferencesController");


router.post("/user/preferences", auth, addPreferences);
router.get("/user/preferences", auth, getPreferences);
router.put("/user/preferences", auth, updatePreferences);

module.exports = router;
