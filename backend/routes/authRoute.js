const express = require("express");
const {
  handelUserSignup,
  handelUserLogin,
  handleUserLogout,
  generateResetPassOTP,
  submitResetPassOTP,
  isloggedin,
  handleGoogleAuth,
} = require("../controllers/authController.js");
const upload = require("../utils/multer");

const router = express.Router();

// User Authentication Routes
router.post("/signup",
  upload.fields([
    { name: 'passportPhoto', maxCount: 1 },
    { name: 'paymentImage', maxCount: 1 }
  ]),
  handelUserSignup
);
router.post("/login", handelUserLogin);
router.post("/logout", handleUserLogout);

// Google OAuth Route
router.post("/google", handleGoogleAuth);

// Password Reset Routes
router.post("/forgot-password", generateResetPassOTP);
router.post("/reset-password", submitResetPassOTP);

// Check Authentication Status
router.get("/status", isloggedin);

module.exports = router;
