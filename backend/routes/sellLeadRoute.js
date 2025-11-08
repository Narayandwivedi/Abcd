const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const {
  // User Controllers
  createSellLead,
  getUserSellLeads,
  getApprovedSellLeads,

  // Admin Controllers
  getAllSellLeadsAdmin,
  approveSellLead,
  rejectSellLead,
  deleteSellLead,
  getSellLeadStats
} = require('../controllers/sellLeadController');

// ========================
// User Routes
// ========================

// Create a new sell lead (no authentication required)
router.post('/create', createSellLead);

// Get user's own sell leads
router.get('/my-leads', auth, getUserSellLeads);

// Get all approved sell leads (public - for homepage)
router.get('/approved', getApprovedSellLeads);

// ========================
// Admin Routes
// ========================

// Get all sell leads with filtering (admin only)
router.get('/admin/all', adminAuth, getAllSellLeadsAdmin);

// Get sell lead statistics (admin only)
router.get('/admin/stats', adminAuth, getSellLeadStats);

// Approve a sell lead (admin only)
router.put('/admin/approve/:id', adminAuth, approveSellLead);

// Reject a sell lead (admin only)
router.put('/admin/reject/:id', adminAuth, rejectSellLead);

// Delete a sell lead (admin only)
router.delete('/admin/delete/:id', adminAuth, deleteSellLead);

module.exports = router;
