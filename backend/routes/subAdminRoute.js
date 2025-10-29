const express = require("express");
const {
  subAdminLogin,
  subAdminLogout,
  getCurrentSubAdmin,
  changeSubAdminPassword
} = require("../controllers/subAdminController");
const { subAdminAuth } = require("../middleware/subAdminAuth");

const router = express.Router();

// Public routes (no authentication required)
router.post("/login", subAdminLogin);

// Protected routes (require authentication)
router.post("/logout", subAdminAuth, subAdminLogout);
router.get("/me", subAdminAuth, getCurrentSubAdmin);
router.put("/change-password", subAdminAuth, changeSubAdminPassword);

module.exports = router;
