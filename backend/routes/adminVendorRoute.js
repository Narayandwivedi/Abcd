const express = require("express");
const {
  getPendingApplications,
  getAllApplications,
  getApplicationDetails,
  approveApplication,
  rejectApplication,
  updateApplicationStatus,
  getAllVendors,
  getVendorWithApplication,
  quickApproveVendor,
  quickRejectVendor,
} = require("../controllers/adminVendorController.js");
const adminAuth = require("../middleware/adminAuth.js");

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

// Vendor management
router.get("/vendors", getAllVendors);
router.get("/vendors/:vendorId", getVendorWithApplication);

// Quick vendor approve/reject (by vendorId)
router.post("/vendors/:vendorId/approve", quickApproveVendor);
router.post("/vendors/:vendorId/reject", quickRejectVendor);

// Get applications
router.get("/applications/pending", getPendingApplications);
router.get("/applications", getAllApplications);
router.get("/applications/:applicationId", getApplicationDetails);

// Application actions (by applicationId)
router.post("/applications/:applicationId/approve", approveApplication);
router.post("/applications/:applicationId/reject", rejectApplication);
router.patch("/applications/:applicationId/status", updateApplicationStatus);

module.exports = router;
