const express = require("express");
const { getAllVendors, approveVendor, setVendorPassword, createVendor } = require("../controllers/adminVendorController.js");
const adminAuth = require("../middleware/adminAuth.js");

const router = express.Router();

// All routes require admin authentication
router.get("/vendors", adminAuth, getAllVendors);
router.post("/vendors", adminAuth, createVendor);
router.put("/vendors/:vendorId/approve", adminAuth, approveVendor);
router.put("/vendors/:vendorId/set-password", adminAuth, setVendorPassword);

module.exports = router;
