const express = require("express");
const {
  submitBusinessForm,
  getVendorDetails,
  getApplicationStatus,
} = require("../controllers/vendorController.js");
const vendorAuth = require("../middleware/vendorAuth.js");

const router = express.Router();

// Protected Vendor Routes - Require Authentication
router.post("/business-form", vendorAuth, submitBusinessForm); // Kept same route for consistency
router.get("/details", vendorAuth, getVendorDetails);
router.get("/application-status", vendorAuth, getApplicationStatus);

module.exports = router;
