const express = require("express");
const {
  submitBusinessForm,
  getVendorDetails,
} = require("../controllers/vendorController.js");
const vendorAuth = require("../middleware/vendorAuth.js");

const router = express.Router();

// Protected Vendor Routes - Require Authentication
router.post("/business-form", vendorAuth, submitBusinessForm);
router.get("/details", vendorAuth, getVendorDetails);

module.exports = router;
