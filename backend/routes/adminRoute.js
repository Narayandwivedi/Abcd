const express = require("express");
const { getAllUsers, approveUser, rejectUser, toggleUserStatus, setUserPassword, adminLogin, adminLogout, getCurrentAdmin, changeAdminPassword, updateUser, deleteUser, createUser } = require("../controllers/adminController");
const { getAllCitiesAdmin, createCity, updateCity, deleteCity, toggleCityStatus } = require("../controllers/cityController");
const { getAllCategoriesAdmin, createCategory, updateCategory, deleteCategory, toggleCategoryStatus, addSubcategory, updateSubcategory, deleteSubcategory } = require("../controllers/categoryController");
const { getAllAds, createAd, updateAd, deleteAd, toggleAdApproval, toggleAdVisibility } = require("../controllers/adController");
const { getAllBlogsAdmin, getBlogByIdAdmin, createBlog, updateBlog, deleteBlog, publishBlog, unpublishBlog, toggleFeatured } = require("../controllers/blogController");
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
router.put("/users/:userId/reject", adminAuth, rejectUser);
router.put("/users/:userId/set-password", adminAuth, setUserPassword);
router.patch("/users/:userId/toggle-status", adminAuth, toggleUserStatus);
router.put("/users/:userId", adminAuth, updateUser);
router.delete("/users/:userId", adminAuth, deleteUser);

// City management routes
router.get("/cities", adminAuth, getAllCitiesAdmin);
router.post("/cities", adminAuth, createCity);
router.put("/cities/:cityId", adminAuth, updateCity);
router.delete("/cities/:cityId", adminAuth, deleteCity);
router.patch("/cities/:cityId/toggle-status", adminAuth, toggleCityStatus);

// Category management routes
router.get("/categories", adminAuth, getAllCategoriesAdmin);
router.post("/categories", adminAuth, createCategory);
router.put("/categories/:categoryId", adminAuth, updateCategory);
router.delete("/categories/:categoryId", adminAuth, deleteCategory);
router.patch("/categories/:categoryId/toggle-status", adminAuth, toggleCategoryStatus);

// Subcategory management routes
router.post("/categories/:categoryId/subcategories", adminAuth, addSubcategory);
router.put("/categories/:categoryId/subcategories/:subcategoryId", adminAuth, updateSubcategory);
router.delete("/categories/:categoryId/subcategories/:subcategoryId", adminAuth, deleteSubcategory);

// Ad management routes
router.get("/ads", adminAuth, getAllAds);
router.post("/ads", adminAuth, upload.single('adImg'), createAd);
router.put("/ads/:adId", adminAuth, upload.single('adImg'), updateAd);
router.delete("/ads/:adId", adminAuth, deleteAd);
router.patch("/ads/:adId/toggle-approval", adminAuth, toggleAdApproval);
router.patch("/ads/:adId/toggle-visibility", adminAuth, toggleAdVisibility);

// Blog management routes
router.get("/blogs", adminAuth, getAllBlogsAdmin);
router.get("/blogs/:blogId", adminAuth, getBlogByIdAdmin);
router.post("/blogs", adminAuth, createBlog);
router.put("/blogs/:blogId", adminAuth, updateBlog);
router.delete("/blogs/:blogId", adminAuth, deleteBlog);
router.patch("/blogs/:blogId/publish", adminAuth, publishBlog);
router.patch("/blogs/:blogId/unpublish", adminAuth, unpublishBlog);
router.patch("/blogs/:blogId/toggle-featured", adminAuth, toggleFeatured);

module.exports = router;
