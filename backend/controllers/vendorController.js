const vendorModel = require("../models/Vendor.js");



// Get current vendor details along with application status
const getVendorDetails = async (req, res) => {
  try {
    const vendorId = req.vendorId; // From auth middleware

    const vendor = await vendorModel.findById(vendorId).select("-password");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Get latest business application
    const application = await BusinessApplication.findOne({ vendorId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      vendorData: vendor,
      application: application || null,
      hasApprovedApplication: vendor.isVerified,
    });
  } catch (err) {
    console.error("Get vendor details error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor details",
      error: err.message,
    });
  }
};

// Get application status
const getApplicationStatus = async (req, res) => {
  try {
    const vendorId = req.vendorId;

    const application = await BusinessApplication.findOne({ vendorId })
      .sort({ createdAt: -1 })
      .populate("reviewedBy", "name email");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "No application found",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (err) {
    console.error("Get application status error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch application status",
      error: err.message,
    });
  }
};

module.exports = {
  getVendorDetails,
  getApplicationStatus,
};
