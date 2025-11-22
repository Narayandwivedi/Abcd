const express = require("express");
const {
  getAllCities,
  getDistricts,
  getCitiesByDistrict
} = require("../controllers/cityController");

const router = express.Router();

// Public routes (no authentication required)
// GET /api/cities?page=1&limit=10&search=raipur
router.get("/", getAllCities);

// GET /api/cities/districts - Get all districts
router.get("/districts", getDistricts);

// GET /api/cities/district/:district - Get cities by specific district
router.get("/district/:district", getCitiesByDistrict);

module.exports = router;
