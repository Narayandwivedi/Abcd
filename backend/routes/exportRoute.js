const express = require("express");
const { exportUsers, exportVendors, exportBuyLeads, exportSellLeads } = require("../controllers/exportController");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// All routes require admin authentication
router.get("/users", adminAuth, exportUsers);
router.get("/vendors", adminAuth, exportVendors);
router.get("/buy-leads", adminAuth, exportBuyLeads);
router.get("/sell-leads", adminAuth, exportSellLeads);

module.exports = router;
