const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const {
  // User Controllers
  createBuyLead,
  getUserBuyLeads,
  getApprovedBuyLeads,

  // Admin Controllers
  getAllBuyLeadsAdmin,
  approveBuyLead,
  rejectBuyLead,
  deleteBuyLead,
  getBuyLeadStats
} = require('../controllers/buyLeadController');

// ========================
// User Routes
// ========================

// Create a new buy lead (authenticated users only)
router.post('/create', auth, createBuyLead);

// Get user's own buy leads
router.get('/my-leads', auth, getUserBuyLeads);

// Get all approved buy leads (public - for homepage)
router.get('/approved', getApprovedBuyLeads);

// ========================
// Admin Routes
// ========================

// Get all buy leads with filtering (admin only)
router.get('/admin/all', adminAuth, getAllBuyLeadsAdmin);

// Get buy lead statistics (admin only)
router.get('/admin/stats', adminAuth, getBuyLeadStats);

// Approve a buy lead (admin only)
router.put('/admin/approve/:id', adminAuth, approveBuyLead);

// Reject a buy lead (admin only)
router.put('/admin/reject/:id', adminAuth, rejectBuyLead);

// Delete a buy lead (admin only)
router.delete('/admin/delete/:id', adminAuth, deleteBuyLead);

module.exports = router;
