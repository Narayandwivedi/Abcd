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

const router = express.Router();

// All routes require admin authentication
router.get("/subadmins", adminAuth, getAllSubAdmins);
router.get("/subadmins/:subAdminId", adminAuth, getSubAdminById);
router.post("/subadmins", adminAuth, createSubAdmin);
router.put("/subadmins/:subAdminId", adminAuth, updateSubAdmin);
router.delete("/subadmins/:subAdminId", adminAuth, deleteSubAdmin);
router.put("/subadmins/:subAdminId/password", adminAuth, changeSubAdminPassword);
router.put("/subadmins/:subAdminId/toggle-status", adminAuth, toggleSubAdminStatus);

module.exports = router;
