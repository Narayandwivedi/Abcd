const express = require("express");
const {
  subAdminLogin,
  subAdminLogout,
  getCurrentSubAdmin,
  changeSubAdminPassword,
  getAllAds,
  createAd,
  updateAd,
  deleteAd,
  toggleAdApproval,
  toggleAdVisibility
} = require("../controllers/subAdminController");
const { getAllUsers, approveUser } = require("../controllers/adminController");
const { getAllVendors, approveVendor } = require("../controllers/adminVendorController");
const { subAdminAuth, checkPermission } = require("../middleware/subAdminAuth");
const upload = require("../utils/multer");

const router = express.Router();

// Public routes (no authentication required)
router.post("/login", subAdminLogin);

// Protected routes (require authentication)
router.post("/logout", subAdminAuth, subAdminLogout);
router.get("/me", subAdminAuth, getCurrentSubAdmin);
router.put("/change-password", subAdminAuth, changeSubAdminPassword);

// User management routes (require specific permissions)
router.get("/users", subAdminAuth, checkPermission('canViewUsers'), getAllUsers);
router.put("/users/:userId/approve", subAdminAuth, checkPermission('canApproveUsers'), approveUser);

// Vendor management routes (require specific permissions)
router.get("/vendors", subAdminAuth, checkPermission('canViewVendors'), getAllVendors);
router.put("/vendors/:vendorId/approve", subAdminAuth, checkPermission('canApproveVendors'), approveVendor);

// Ad management routes (require specific permissions)
router.get("/ads", subAdminAuth, checkPermission('canViewAds'), getAllAds);
router.post("/ads", subAdminAuth, checkPermission('canCreateAds'), upload.single('adImg'), createAd);
router.put("/ads/:adId", subAdminAuth, checkPermission('canEditAds'), upload.single('adImg'), updateAd);
router.delete("/ads/:adId", subAdminAuth, checkPermission('canDeleteAds'), deleteAd);
router.patch("/ads/:adId/toggle-approval", subAdminAuth, checkPermission('canApproveAds'), toggleAdApproval);
router.patch("/ads/:adId/toggle-visibility", subAdminAuth, checkPermission('canEditAds'), toggleAdVisibility);

module.exports = router;
