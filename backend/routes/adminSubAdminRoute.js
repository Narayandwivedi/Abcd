const express = require("express");
const {
  getAllSubAdmins,
  getSubAdminById,
  createSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
  changeSubAdminPassword,
  toggleSubAdminStatus
} = require("../controllers/adminSubAdminController");
const adminAuth = require("../middleware/adminAuth");
const checkPermission = require("../middleware/checkPermission");

const router = express.Router();

// All routes require admin authentication AND superadmin role
router.get("/subadmins", adminAuth, checkPermission(), getAllSubAdmins);
router.get("/subadmins/:subAdminId", adminAuth, checkPermission(), getSubAdminById);
router.post("/subadmins", adminAuth, checkPermission(), createSubAdmin);
router.put("/subadmins/:subAdminId", adminAuth, checkPermission(), updateSubAdmin);
router.delete("/subadmins/:subAdminId", adminAuth, checkPermission(), deleteSubAdmin);
router.put("/subadmins/:subAdminId/password", adminAuth, checkPermission(), changeSubAdminPassword);
router.put("/subadmins/:subAdminId/toggle-status", adminAuth, checkPermission(), toggleSubAdminStatus);

module.exports = router;
