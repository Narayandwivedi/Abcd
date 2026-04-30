const express = require("express");
const { getAllUsers, approveUser, rejectUser, toggleUserStatus, setUserPassword, adminLogin, adminLogout, getCurrentAdmin, changeAdminPassword, updateUser, deleteUser, createUser } = require("../controllers/adminController");
const { getAllCitiesAdmin, createCity, updateCity, deleteCity, toggleCityStatus } = require("../controllers/cityController");
const { getAllCategoriesAdmin, createCategory, updateCategory, deleteCategory, toggleCategoryStatus, addSubcategory, updateSubcategory, deleteSubcategory } = require("../controllers/categoryController");
const { getAllAds, createAd, updateAd, deleteAd, toggleAdApproval, toggleAdVisibility } = require("../controllers/adController");
const { getAllBlogsAdmin, getBlogByIdAdmin, createBlog, updateBlog, deleteBlog, publishBlog, unpublishBlog, toggleFeatured } = require("../controllers/blogController");
const adminAuth = require("../middleware/adminAuth");
const checkPermission = require("../middleware/checkPermission");
const { adminLoginLimiter } = require("../middleware/adminRateLimit");
const upload = require("../utils/multer");

const router = express.Router();

// Public routes (no authentication required)
router.post("/login", adminLoginLimiter, adminLogin);

// Protected routes (require authentication)
router.post("/logout", adminAuth, adminLogout);
router.get("/me", adminAuth, getCurrentAdmin);
router.put("/change-password", adminAuth, changeAdminPassword);

// User management routes
router.get("/users", adminAuth, checkPermission('canViewUsers'), getAllUsers);
router.post("/users", adminAuth, checkPermission('canCreateUsers'), upload.single('passportPhoto'), createUser);
router.put("/users/:userId/approve", adminAuth, checkPermission('canApproveUsers'), approveUser);
router.put("/users/:userId/reject", adminAuth, checkPermission('canApproveUsers'), rejectUser);
router.put("/users/:userId/set-password", adminAuth, checkPermission('canEditUsers'), setUserPassword);
router.patch("/users/:userId/toggle-status", adminAuth, checkPermission('canEditUsers'), toggleUserStatus);
router.put("/users/:userId", adminAuth, checkPermission('canEditUsers'), updateUser);
router.delete("/users/:userId", adminAuth, checkPermission('canDeleteUsers'), deleteUser);

// City management routes
router.get("/cities", adminAuth, checkPermission('canManageContent'), getAllCitiesAdmin);
router.post("/cities", adminAuth, checkPermission('canManageContent'), createCity);
router.put("/cities/:cityId", adminAuth, checkPermission('canManageContent'), updateCity);
router.delete("/cities/:cityId", adminAuth, checkPermission('canManageContent'), deleteCity);
router.patch("/cities/:cityId/toggle-status", adminAuth, checkPermission('canManageContent'), toggleCityStatus);

// Category management routes
router.get("/categories", adminAuth, checkPermission('canManageContent'), getAllCategoriesAdmin);
router.post("/categories", adminAuth, checkPermission('canManageContent'), upload.single('image'), createCategory);
router.put("/categories/:categoryId", adminAuth, checkPermission('canManageContent'), upload.single('image'), updateCategory);
router.delete("/categories/:categoryId", adminAuth, checkPermission('canManageContent'), deleteCategory);
router.patch("/categories/:categoryId/toggle-status", adminAuth, checkPermission('canManageContent'), toggleCategoryStatus);

// Subcategory management routes
router.post("/categories/:categoryId/subcategories", adminAuth, checkPermission('canManageContent'), addSubcategory);
router.put("/categories/:categoryId/subcategories/:subcategoryId", adminAuth, checkPermission('canManageContent'), updateSubcategory);
router.delete("/categories/:categoryId/subcategories/:subcategoryId", adminAuth, checkPermission('canManageContent'), deleteSubcategory);

// Ad management routes
router.get("/ads", adminAuth, checkPermission('canViewAds'), getAllAds);
router.post("/ads", adminAuth, checkPermission('canCreateAds'), upload.single('adImg'), createAd);
router.put("/ads/:adId", adminAuth, checkPermission('canEditAds'), upload.single('adImg'), updateAd);
router.delete("/ads/:adId", adminAuth, checkPermission('canDeleteAds'), deleteAd);
router.patch("/ads/:adId/toggle-approval", adminAuth, checkPermission('canApproveAds'), toggleAdApproval);
router.patch("/ads/:adId/toggle-visibility", adminAuth, checkPermission('canEditAds'), toggleAdVisibility);

// Blog management routes
router.get("/blogs", adminAuth, checkPermission('canViewBlogs'), getAllBlogsAdmin);
router.get("/blogs/:blogId", adminAuth, checkPermission('canViewBlogs'), getBlogByIdAdmin);
router.post("/blogs", adminAuth, checkPermission('canCreateBlogs'), createBlog);
router.put("/blogs/:blogId", adminAuth, checkPermission('canEditBlogs'), updateBlog);
router.delete("/blogs/:blogId", adminAuth, checkPermission('canDeleteBlogs'), deleteBlog);
router.patch("/blogs/:blogId/publish", adminAuth, checkPermission('canPublishBlogs'), publishBlog);
router.patch("/blogs/:blogId/unpublish", adminAuth, checkPermission('canPublishBlogs'), unpublishBlog);
router.patch("/blogs/:blogId/toggle-featured", adminAuth, checkPermission('canEditBlogs'), toggleFeatured);

module.exports = router;
