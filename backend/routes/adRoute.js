const express = require("express");
const { getActiveAds } = require("../controllers/adController");

const router = express.Router();

// Public route - Get all active ads for frontend display
router.get("/active", getActiveAds);

module.exports = router;
