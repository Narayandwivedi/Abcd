const express = require("express");
const {
  handleVendorSignup,
  handleVendorLogin,
  handleVendorLogout,
  isVendorLoggedIn,
} = require("../controllers/vendorAuthController.js");

const router = express.Router();

// Vendor Authentication Routes
router.post("/signup", handleVendorSignup);
router.post("/login", handleVendorLogin);
router.post("/logout", handleVendorLogout);

// Check Vendor Authentication Status
router.get("/status", isVendorLoggedIn);

module.exports = router;
