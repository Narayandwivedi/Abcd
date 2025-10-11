const vendorModel = require("../models/Vendor.js");
const BusinessApplication = require("../models/BusinessApplication.js");

// Submit Business Application
const submitBusinessForm = async (req, res) => {
  try {
    const vendorId = req.vendorId; // From auth middleware

    // Check if vendor already has an approved or pending application
    const existingApplication = await BusinessApplication.findOne({
      vendorId,
      applicationStatus: { $in: ["pending", "under_review", "approved"] }
    });

    if (existingApplication) {
      if (existingApplication.applicationStatus === "approved") {
        return res.status(403).json({
          success: false,
          message: "Your business application has already been approved.",
        });
      }
      return res.status(403).json({
        success: false,
        message: "You already have a pending application. Please wait for admin review.",
      });
    }

    const {
      businessName,
      ownerName,
      mobile,
      gstNumber,
      businessCategory,
      businessAddress,
      bankAccount,
      upiId,
      verificationDocuments,
    } = req.body;

    // Validation - require key business information
    if (!businessName || !ownerName || !mobile || !gstNumber || !businessCategory) {
      return res.status(400).json({
        success: false,
        message: "Business name, owner name, mobile, GST number, and business category are required",
      });
    }

    // Validate business address
    if (!businessAddress || !businessAddress.street || !businessAddress.city || !businessAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: "Complete business address (street, city, pincode) is required",
      });
    }

    // Validate mobile number (Indian format)
    if (mobile < 6000000000 || mobile > 9999999999) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Indian mobile number",
      });
    }

    // Validate GST number (must be exactly 15 characters)
    if (gstNumber.length !== 15) {
      return res.status(400).json({
        success: false,
        message: "GST number must be exactly 15 characters",
      });
    }

    // Check if GST is already used by another approved application
    const existingGST = await BusinessApplication.findOne({
      gstNumber,
      applicationStatus: "approved",
      vendorId: { $ne: vendorId }
    });

    if (existingGST) {
      return res.status(400).json({
        success: false,
        message: "GST number is already registered by another vendor",
      });
    }

    // Create business application
    const applicationData = {
      vendorId,
      businessName,
      ownerName,
      mobile,
      gstNumber,
      businessCategory,
      businessAddress: {
        ...businessAddress,
        state: "Chhattisgarh" // Hardcoded - only Chhattisgarh allowed
      },
      bankAccount: bankAccount || {},
      upiId: upiId || {},
      verificationDocuments: verificationDocuments || {},
      applicationStatus: "pending",
      submittedAt: new Date(),
    };

    const newApplication = await BusinessApplication.create(applicationData);

    // Update vendor to mark application as submitted
    await vendorModel.findByIdAndUpdate(vendorId, {
      isBusinessApplicationSubmitted: true
    });

    console.log('✅ Business application submitted successfully for vendor:', vendorId);

    return res.status(201).json({
      success: true,
      message: "Business application submitted successfully. Please wait for admin approval.",
      application: newApplication,
    });
  } catch (err) {
    console.error("Business application submission error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to submit business application",
      error: err.message,
    });
  }
};

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
  submitBusinessForm,
  getVendorDetails,
  getApplicationStatus,
};
