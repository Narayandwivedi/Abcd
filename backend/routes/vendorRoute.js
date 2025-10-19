const express = require("express");
const {
  getVendorDetails,
  getApplicationStatus,
} = require("../controllers/vendorController.js");
const vendorAuth = require("../middleware/vendorAuth.js");

const router = express.Router();

// Protected Vendor Routes - Require Authentication
router.get("/details", vendorAuth, getVendorDetails);
router.get("/application-status", vendorAuth, getApplicationStatus);

module.exports = router;
