const userModel = require("../models/User.js");
const Vendor = require("../models/Vendor.js");
const BuyLead = require("../models/BuyLead.js");
const SellLead = require("../models/SellLead.js");

// Export all users
const exportUsers = async (req, res) => {
  try {
    const users = await userModel.find()
      .select('-password')
      .populate('activeCertificate', 'certificateNumber issueDate expiryDate renewalCount')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Export users error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Export all vendors
const exportVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: vendors,
      count: vendors.length
    });
  } catch (error) {
    console.error('Export vendors error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Export all buy leads
const exportBuyLeads = async (req, res) => {
  try {
    const buyLeads = await BuyLead.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: buyLeads,
      count: buyLeads.length
    });
  } catch (error) {
    console.error('Export buy leads error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Export all sell leads
const exportSellLeads = async (req, res) => {
  try {
    const sellLeads = await SellLead.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: sellLeads,
      count: sellLeads.length
    });
  } catch (error) {
    console.error('Export sell leads error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  exportUsers,
  exportVendors,
  exportBuyLeads,
  exportSellLeads
};
