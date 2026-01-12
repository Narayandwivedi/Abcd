const express = require("express");
const {
  getAllCities,
  getStates,
  getDistricts,
  getDistrictsByState,
  getCitiesByState,
  getCitiesByDistrict
} = require("../controllers/cityController");

const router = express.Router();

// Public routes (no authentication required)
// GET /api/cities?page=1&limit=10&search=raipur
router.get("/", getAllCities);

// GET /api/cities/states - Get all states
router.get("/states", getStates);

// GET /api/cities/districts - Get all districts
router.get("/districts", getDistricts);

// GET /api/cities/districts/:state - Get all districts by state
router.get("/districts/:state", getDistrictsByState);

// GET /api/cities/state/:state - Get cities by specific state
router.get("/state/:state", getCitiesByState);

// GET /api/cities/district/:district - Get cities by specific district
router.get("/district/:district", getCitiesByDistrict);

module.exports = router;
