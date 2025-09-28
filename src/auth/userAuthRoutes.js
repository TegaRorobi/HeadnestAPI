const express = require("express");
const authController = require("../controllers/userAuthController");
const {
  validateRegistration,
  validateLogin,
} = require("../middlewares/validateMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const { deleteAccount } = require("../controllers/userAuthController");

const router = express.Router();

// Registration route (with validation middleware)
router.post(
  "/user/auth/register",
  validateRegistration,
  authController.register
);

router.post(
  "/user/auth/login",
  validateLogin,
  authController.login
);

//verify verification link
router.get("/user/auth/verify-email", authController.verifyEmail);
router.post("/user/auth/resend-link", authController.resendLink);

router.delete("user/auth/delete", authMiddleware, deleteAccount);

router.post("/user/auth/token/refresh", authController.tokenRefresh);

module.exports = router;
