const express = require("express");
const { getAllUsers, approveUser, setUserPassword, adminLogin, adminLogout, getCurrentAdmin, changeAdminPassword, updateUser, deleteUser, createUser } = require("../controllers/adminController");
const { getAllCitiesAdmin, createCity, updateCity, deleteCity, toggleCityStatus } = require("../controllers/cityController");
const adminAuth = require("../middleware/adminAuth");
const { adminLoginLimiter } = require("../middleware/adminRateLimit");
const upload = require("../utils/multer");

const router = express.Router();

// Public routes (no authentication required)
router.post("/login", adminLoginLimiter, adminLogin);

// Protected routes (require authentication)
router.post("/logout", adminAuth, adminLogout);
router.get("/me", adminAuth, getCurrentAdmin);
router.put("/change-password", adminAuth, changeAdminPassword);
router.get("/users", adminAuth, getAllUsers);
router.post("/users", adminAuth, upload.single('passportPhoto'), createUser);
router.put("/users/:userId/approve", adminAuth, approveUser);
router.put("/users/:userId/set-password", adminAuth, setUserPassword);
router.put("/users/:userId", adminAuth, updateUser);
router.delete("/users/:userId", adminAuth, deleteUser);

// City management routes
router.get("/cities", adminAuth, getAllCitiesAdmin);
router.post("/cities", adminAuth, createCity);
router.put("/cities/:cityId", adminAuth, updateCity);
router.delete("/cities/:cityId", adminAuth, deleteCity);
router.patch("/cities/:cityId/toggle-status", adminAuth, toggleCityStatus);

module.exports = router;
