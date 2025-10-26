const express = require("express");
const { getAllUsers, approveUser, setUserPassword, adminLogin, adminLogout, getCurrentAdmin, changeAdminPassword } = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");
const { adminLoginLimiter } = require("../middleware/adminRateLimit");

const router = express.Router();

// Public routes (no authentication required)
router.post("/login", adminLoginLimiter, adminLogin);

// Protected routes (require authentication)
router.post("/logout", adminAuth, adminLogout);
router.get("/me", adminAuth, getCurrentAdmin);
router.put("/change-password", adminAuth, changeAdminPassword);
router.get("/users", adminAuth, getAllUsers);
router.put("/users/:userId/approve", adminAuth, approveUser);
router.put("/users/:userId/set-password", adminAuth, setUserPassword);

module.exports = router;
