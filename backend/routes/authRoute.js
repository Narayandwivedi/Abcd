const express = require("express");
const {
  handelUserSignup,
  handelUserLogin,
  handleUserLogout,
  isloggedin,
} = require("../controllers/authController.js");

const router = express.Router();

// User Authentication Routes
router.post("/signup", handelUserSignup);
router.post("/login", handelUserLogin);
router.post("/logout", handleUserLogout);

// Check Authentication Status
router.get("/status", isloggedin);

module.exports = router;
