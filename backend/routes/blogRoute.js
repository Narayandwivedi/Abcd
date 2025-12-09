const express = require("express");
const { getAllBlogs, getBlogBySlug, likeBlog } = require("../controllers/blogController");

const router = express.Router();

// Public routes (no authentication required)

// GET /api/blogs - Get all published blogs with pagination and filters
router.get("/", getAllBlogs);

// GET /api/blogs/:slug - Get single blog by slug (increments views)
router.get("/:slug", getBlogBySlug);

// POST /api/blogs/:slug/like - Increment blog likes
router.post("/:slug/like", likeBlog);

module.exports = router;
