const express = require("express");
const {
  getVendorDetails,
  getApplicationStatus,
  getVendorBySlug,
} = require("../controllers/vendorController.js");
const vendorAuth = require("../middleware/vendorAuth.js");

const router = express.Router();

// Public Routes - No Authentication Required
router.get("/public/:slug", getVendorBySlug);

// Protected Vendor Routes - Require Authentication
router.get("/details", vendorAuth, getVendorDetails);
router.get("/application-status", vendorAuth, getApplicationStatus);

module.exports = router;
