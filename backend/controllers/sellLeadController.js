const SellLead = require('../models/SellLead');

// User Controllers

// Create a new sell lead (User)
const createSellLead = async (req, res) => {
  try {
    const {
      vendorName,
      vendorLocation,
      productServiceOffered,
      brand,
      modelDetail,
      mrpListPrice,
      specialOfferPrice,
      stockQtyAvailable,
      validity,
      mobileNo
    } = req.body;

    // Validate required fields
    if (!vendorName || !vendorLocation || !productServiceOffered ||
        !brand || !mrpListPrice || !specialOfferPrice ||
        !stockQtyAvailable || !validity || !mobileNo) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled'
      });
    }

    // Get user ID from authenticated user (if available)
    const userId = req.user ? req.user._id : null;

    // Create new sell lead
    const sellLead = new SellLead({
      userId,
      vendorName,
      vendorLocation,
      productServiceOffered,
      brand,
      modelDetail,
      mrpListPrice,
      specialOfferPrice,
      stockQtyAvailable,
      validity,
      mobileNo,
      status: 'pending'
    });

    await sellLead.save();

    res.status(201).json({
      success: true,
      message: 'Sell lead submitted successfully and is pending approval',
      data: sellLead
    });

  } catch (error) {
    console.error('Error creating sell lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sell lead',
      error: error.message
    });
  }
};

// Get user's own sell leads
const getUserSellLeads = async (req, res) => {
  try {
    const userId = req.user._id;

    const sellLeads = await SellLead.find({ userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'fullName mobile email');

    res.status(200).json({
      success: true,
      count: sellLeads.length,
      data: sellLeads
    });

  } catch (error) {
    console.error('Error fetching user sell leads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sell leads',
      error: error.message
    });
  }
};

// Get all approved sell leads (Public - for homepage)
const getApprovedSellLeads = async (req, res) => {
  try {
    const sellLeads = await SellLead.find({ status: 'approved' })
      .sort({ approvedAt: -1, createdAt: -1 })
      .limit(100) // Limit to latest 100
      .populate('userId', 'fullName city');

    res.status(200).json({
      success: true,
      count: sellLeads.length,
      data: sellLeads
    });

  } catch (error) {
    console.error('Error fetching approved sell leads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approved sell leads',
      error: error.message
    });
  }
};

// Admin Controllers

// Get all sell leads for admin (with filtering)
const getAllSellLeadsAdmin = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const sellLeads = await SellLead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'fullName mobile email city')
      .populate('approvedBy', 'name email');

    const total = await SellLead.countDocuments(query);

    res.status(200).json({
      success: true,
      count: sellLeads.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: sellLeads
    });

  } catch (error) {
    console.error('Error fetching sell leads for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sell leads',
      error: error.message
    });
  }
};

// Approve sell lead (Admin)
const approveSellLead = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.admin._id;

    const sellLead = await SellLead.findById(id);

    if (!sellLead) {
      return res.status(404).json({
        success: false,
        message: 'Sell lead not found'
      });
    }

    if (sellLead.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Sell lead is already approved'
      });
    }

    sellLead.status = 'approved';
    sellLead.approvedBy = adminId;
    sellLead.approvedAt = new Date();
    sellLead.rejectionReason = undefined; // Clear any previous rejection reason

    await sellLead.save();

    res.status(200).json({
      success: true,
      message: 'Sell lead approved successfully',
      data: sellLead
    });

  } catch (error) {
    console.error('Error approving sell lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve sell lead',
      error: error.message
    });
  }
};

// Reject sell lead (Admin)
const rejectSellLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const sellLead = await SellLead.findById(id);

    if (!sellLead) {
      return res.status(404).json({
        success: false,
        message: 'Sell lead not found'
      });
    }

    sellLead.status = 'rejected';
    sellLead.rejectionReason = reason || 'No reason provided';
    sellLead.approvedBy = undefined;
    sellLead.approvedAt = undefined;

    await sellLead.save();

    res.status(200).json({
      success: true,
      message: 'Sell lead rejected successfully',
      data: sellLead
    });

  } catch (error) {
    console.error('Error rejecting sell lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject sell lead',
      error: error.message
    });
  }
};

// Delete sell lead (Admin)
const deleteSellLead = async (req, res) => {
  try {
    const { id } = req.params;

    const sellLead = await SellLead.findByIdAndDelete(id);

    if (!sellLead) {
      return res.status(404).json({
        success: false,
        message: 'Sell lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sell lead deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting sell lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete sell lead',
      error: error.message
    });
  }
};

// Get sell lead statistics (Admin)
const getSellLeadStats = async (req, res) => {
  try {
    const stats = await SellLead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });

    res.status(200).json({
      success: true,
      data: formattedStats
    });

  } catch (error) {
    console.error('Error fetching sell lead stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

module.exports = {
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
};
