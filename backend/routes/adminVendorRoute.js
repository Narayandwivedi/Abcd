const express = require("express");
const { getAllVendors, approveVendor, rejectVendor, setVendorPassword, createVendor, updateVendor, toggleVendorStatus, deleteVendor } = require("../controllers/adminVendorController.js");
const adminAuth = require("../middleware/adminAuth.js");
const checkPermission = require("../middleware/checkPermission");
const upload = require("../utils/multer");

const router = express.Router();

// All routes require admin authentication
router.get("/vendors", adminAuth, checkPermission('canViewVendors'), getAllVendors);
router.post("/vendors", adminAuth, checkPermission('canCreateVendors'),
  upload.fields([
    { name: 'vendorPhoto', maxCount: 1 },
    { name: 'ownerPhotos', maxCount: 10 },
    { name: 'paymentScreenshot', maxCount: 1 },
  ]),
  createVendor
);
router.put("/vendors/:vendorId", adminAuth, checkPermission('canEditVendors'), updateVendor);
router.put("/vendors/:vendorId/approve", adminAuth, checkPermission('canApproveVendors'), approveVendor);
router.put("/vendors/:vendorId/reject", adminAuth, checkPermission('canApproveVendors'), rejectVendor);
router.put("/vendors/:vendorId/set-password", adminAuth, checkPermission('canEditVendors'), setVendorPassword);
router.patch("/vendors/:vendorId/toggle-status", adminAuth, checkPermission('canEditVendors'), toggleVendorStatus);
router.delete("/vendors/:vendorId", adminAuth, checkPermission('canDeleteVendors'), deleteVendor);

module.exports = router;
