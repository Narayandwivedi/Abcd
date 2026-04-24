const express = require("express");
const { getAllVendors, approveVendor, rejectVendor, setVendorPassword, createVendor, updateVendor, toggleVendorStatus, deleteVendor } = require("../controllers/adminVendorController.js");
const adminAuth = require("../middleware/adminAuth.js");
const upload = require("../utils/multer");

const router = express.Router();

// All routes require admin authentication
router.get("/vendors", adminAuth, getAllVendors);
router.post("/vendors", adminAuth,
  upload.fields([
    { name: 'vendorPhoto', maxCount: 1 },
    { name: 'ownerPhotos', maxCount: 10 },
    { name: 'paymentScreenshot', maxCount: 1 },
  ]),
  createVendor
);
router.put("/vendors/:vendorId", adminAuth, updateVendor);
router.put("/vendors/:vendorId/approve", adminAuth, approveVendor);
router.put("/vendors/:vendorId/reject", adminAuth, rejectVendor);
router.put("/vendors/:vendorId/set-password", adminAuth, setVendorPassword);
router.patch("/vendors/:vendorId/toggle-status", adminAuth, toggleVendorStatus);
router.delete("/vendors/:vendorId", adminAuth, deleteVendor);

module.exports = router;
