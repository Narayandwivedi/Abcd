const bcrypt = require("bcryptjs");
const vendorModel = require("../models/Vendor.js");
const { generateVendorCertificatePDF } = require("../utils/generateVendorCertificate.js");

// Get all vendors (for admin)
const getAllVendors = async (req, res) => {
  try {
    const vendors = await vendorModel.find()
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      vendors
    });
  } catch (error) {
    console.error('Get all vendors error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Approve vendor
const approveVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await vendorModel.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    // Generate certificate PDF
    const certificateData = await generateVendorCertificatePDF(vendor);

    // Update payment verification status and certificate details
    vendor.paymentVerified = true;
    vendor.isVerified = true;
    vendor.certificateNumber = certificateData.certificateNumber;
    vendor.certificateDownloadLink = certificateData.downloadLink;
    vendor.certificateIssueDate = certificateData.issueDate;
    vendor.certificateExpiryDate = certificateData.expiryDate;
    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "Vendor approved successfully and certificate generated",
      vendor: {
        _id: vendor._id,
        businessName: vendor.businessName,
        ownerName: vendor.ownerName,
        email: vendor.email,
        mobile: vendor.mobile,
        paymentVerified: vendor.paymentVerified,
        certificateNumber: vendor.certificateNumber,
        certificateDownloadLink: vendor.certificateDownloadLink
      }
    });
  } catch (error) {
    console.error('Approve vendor error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Set password for vendor
const setVendorPassword = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    const vendor = await vendorModel.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update vendor password
    vendor.password = hashedPassword;
    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "Password set successfully"
    });
  } catch (error) {
    console.error('Set vendor password error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllVendors,
  approveVendor,
  setVendorPassword
};
