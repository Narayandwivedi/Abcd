const express = require("express");
const { getAllCategories, getCategoryById } = require("../controllers/categoryController");

const router = express.Router();

// Public routes (no authentication required)
// GET /api/categories - Get all active categories with subcategories
router.get("/", getAllCategories);

// GET /api/categories/:categoryId - Get category by ID or slug
router.get("/:categoryId", getCategoryById);

module.exports = router;
