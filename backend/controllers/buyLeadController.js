const BuyLead = require('../models/BuyLead');

// User Controllers

// Create a new buy lead (User)
const createBuyLead = async (req, res) => {
  try {
    const {
      name,
      mobileNo,
      townCity,
      itemRequired,
      majorCategory,
      minorCategory,
      qualityQuantityDesc,
      priceRange,
      deliveryAddress
    } = req.body;

    // Validate required fields
    if (!name || !mobileNo || !townCity || !itemRequired ||
        !majorCategory || !minorCategory || !qualityQuantityDesc ||
        !priceRange || !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Get user ID from authenticated user
    const userId = req.user._id;

    // Create new buy lead
    const buyLead = new BuyLead({
      userId,
      name,
      mobileNo,
      townCity,
      itemRequired,
      majorCategory,
      minorCategory,
      qualityQuantityDesc,
      priceRange,
      deliveryAddress,
      status: 'pending'
    });

    await buyLead.save();

    res.status(201).json({
      success: true,
      message: 'Buy lead submitted successfully and is pending approval',
      data: buyLead
    });

  } catch (error) {
    console.error('Error creating buy lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create buy lead',
      error: error.message
    });
  }
};

// Get user's own buy leads
const getUserBuyLeads = async (req, res) => {
  try {
    const userId = req.user._id;

    const buyLeads = await BuyLead.find({ userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'fullName mobile email');

    res.status(200).json({
      success: true,
      count: buyLeads.length,
      data: buyLeads
    });

  } catch (error) {
    console.error('Error fetching user buy leads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch buy leads',
      error: error.message
    });
  }
};

// Get all approved buy leads (Public - for homepage)
const getApprovedBuyLeads = async (req, res) => {
  try {
    const buyLeads = await BuyLead.find({ status: 'approved' })
      .sort({ approvedAt: -1, createdAt: -1 })
      .limit(100) // Limit to latest 100
      .populate('userId', 'fullName city');

    res.status(200).json({
      success: true,
      count: buyLeads.length,
      data: buyLeads
    });

  } catch (error) {
    console.error('Error fetching approved buy leads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approved buy leads',
      error: error.message
    });
  }
};

// Admin Controllers

// Get all buy leads for admin (with filtering)
const getAllBuyLeadsAdmin = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const buyLeads = await BuyLead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'fullName mobile email city')
      .populate('approvedBy', 'name email');

    const total = await BuyLead.countDocuments(query);

    res.status(200).json({
      success: true,
      count: buyLeads.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: buyLeads
    });

  } catch (error) {
    console.error('Error fetching buy leads for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch buy leads',
      error: error.message
    });
  }
};

// Approve buy lead (Admin)
const approveBuyLead = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.admin._id;

    const buyLead = await BuyLead.findById(id);

    if (!buyLead) {
      return res.status(404).json({
        success: false,
        message: 'Buy lead not found'
      });
    }

    if (buyLead.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Buy lead is already approved'
      });
    }

    buyLead.status = 'approved';
    buyLead.approvedBy = adminId;
    buyLead.approvedAt = new Date();
    buyLead.rejectionReason = undefined; // Clear any previous rejection reason

    await buyLead.save();

    res.status(200).json({
      success: true,
      message: 'Buy lead approved successfully',
      data: buyLead
    });

  } catch (error) {
    console.error('Error approving buy lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve buy lead',
      error: error.message
    });
  }
};

// Reject buy lead (Admin)
const rejectBuyLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const buyLead = await BuyLead.findById(id);

    if (!buyLead) {
      return res.status(404).json({
        success: false,
        message: 'Buy lead not found'
      });
    }

    buyLead.status = 'rejected';
    buyLead.rejectionReason = reason || 'No reason provided';
    buyLead.approvedBy = undefined;
    buyLead.approvedAt = undefined;

    await buyLead.save();

    res.status(200).json({
      success: true,
      message: 'Buy lead rejected successfully',
      data: buyLead
    });

  } catch (error) {
    console.error('Error rejecting buy lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject buy lead',
      error: error.message
    });
  }
};

// Delete buy lead (Admin)
const deleteBuyLead = async (req, res) => {
  try {
    const { id } = req.params;

    const buyLead = await BuyLead.findByIdAndDelete(id);

    if (!buyLead) {
      return res.status(404).json({
        success: false,
        message: 'Buy lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Buy lead deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting buy lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete buy lead',
      error: error.message
    });
  }
};

// Get buy lead statistics (Admin)
const getBuyLeadStats = async (req, res) => {
  try {
    const stats = await BuyLead.aggregate([
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
    console.error('Error fetching buy lead stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

module.exports = {
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
};
