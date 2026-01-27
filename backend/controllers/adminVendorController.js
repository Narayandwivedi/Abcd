const bcrypt = require("bcryptjs");
const vendorModel = require("../models/Vendor.js");
const VendorCertificate = require("../models/VendorCertificate.js");
const { generateVendorCertificatePDF } = require("../utils/generateVendorCertificate.js");

// Get all vendors (for admin)
const getAllVendors = async (req, res) => {
  try {
    const vendors = await vendorModel.find()
      .select('-password')
      .populate('activeCertificate', 'certificateNumber downloadLink issueDate expiryDate renewalCount status pdfDeleted')
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

    // Create certificate document
    const certificate = new VendorCertificate({
      certificateNumber: certificateData.certificateNumber,
      vendorId: vendor._id,
      downloadLink: certificateData.downloadLink,
      issueDate: certificateData.issueDate,
      expiryDate: certificateData.expiryDate,
      renewalCount: 0,
      status: 'active'
    });

    await certificate.save();

    // Update payment verification status and certificate reference
    vendor.paymentVerified = true;
    vendor.isVerified = true;
    vendor.isRejected = false; // Clear rejection status if re-approving
    vendor.rejectionReason = undefined; // Clear rejection reason
    vendor.activeCertificate = certificate._id;
    await vendor.save();

    console.log(`[ADMIN] Vendor approved and certificate generated: ${vendor.businessName} - ${certificate.certificateNumber}`);

    return res.status(200).json({
      success: true,
      message: "Vendor approved successfully and certificate generated",
      vendor: {
        _id: vendor._id,
        businessName: vendor.businessName,
        ownerName: vendor.ownerName,
        email: vendor.email,
        mobile: vendor.mobile,
        paymentVerified: vendor.paymentVerified
      },
      certificate: {
        certificateNumber: certificate.certificateNumber,
        downloadLink: certificate.downloadLink,
        issueDate: certificate.issueDate,
        expiryDate: certificate.expiryDate
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

// Create vendor (admin)
const createVendor = async (req, res) => {
  try {
    const { ownerName, businessName, mobile, email, state, city, businessCategories, membershipFees, password } = req.body;

    // Validate required fields
    if (!ownerName || !businessName || !mobile || !state || !city || !businessCategories || !Array.isArray(businessCategories) || businessCategories.length === 0 || !membershipFees) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided including state, city, at least one category and subcategory"
      });
    }

    if (businessCategories.length > 5) {
      return res.status(400).json({ success: false, message: "Maximum 5 business categories allowed" });
    }

    // Check if mobile already exists
    const existingVendor = await vendorModel.findOne({ mobile });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor with this mobile number already exists"
      });
    }

    // Check if email is provided and already exists
    if (email && email.trim()) {
      const existingEmail = await vendorModel.findOne({ email: email.trim() });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Vendor with this email already exists"
        });
      }
    }

    // Create vendor data
    const vendorData = {
      ownerName,
      businessName,
      mobile,
      state,
      city,
      businessCategories,
      membershipFees,
      paymentVerified: true,
      isVerified: true,
      isMobileVerified: true
    };

    // Only add email if it's provided and not empty
    if (email && email.trim()) {
      vendorData.email = email.trim();
    }

    // Hash password if provided
    if (password && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      vendorData.password = await bcrypt.hash(password, salt);
    }

    const vendor = await vendorModel.create(vendorData);

    // Generate certificate
    const certificateData = await generateVendorCertificatePDF(vendor);

    // Create certificate document
    const certificate = new VendorCertificate({
      certificateNumber: certificateData.certificateNumber,
      vendorId: vendor._id,
      downloadLink: certificateData.downloadLink,
      issueDate: certificateData.issueDate,
      expiryDate: certificateData.expiryDate,
      renewalCount: 0,
      status: 'active'
    });

    await certificate.save();

    // Update vendor with certificate reference
    vendor.activeCertificate = certificate._id;
    await vendor.save();

    console.log(`[ADMIN] Vendor created with certificate: ${vendor.businessName} - ${certificate.certificateNumber}`);

    return res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      vendor: {
        _id: vendor._id,
        businessName: vendor.businessName,
        ownerName: vendor.ownerName,
        mobile: vendor.mobile
      },
      certificate: {
        certificateNumber: certificate.certificateNumber,
        downloadLink: certificate.downloadLink,
        issueDate: certificate.issueDate,
        expiryDate: certificate.expiryDate
      }
    });
  } catch (error) {
    console.error('Create vendor error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update vendor (admin)
const updateVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { ownerName, businessName, mobile, email, state, city, businessCategories, membershipFees } = req.body;

    // Validate required fields
    if (!ownerName || !businessName || !mobile || !state || !city || !businessCategories || !Array.isArray(businessCategories) || businessCategories.length === 0 || !membershipFees) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided including state, city, at least one category and subcategory"
      });
    }

    if (businessCategories.length > 5) {
      return res.status(400).json({ success: false, message: "Maximum 5 business categories allowed" });
    }

    const vendor = await vendorModel.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    // Check if mobile is being changed and if it already exists
    if (mobile !== vendor.mobile) {
      const existingMobile = await vendorModel.findOne({ mobile, _id: { $ne: vendorId } });
      if (existingMobile) {
        return res.status(400).json({
          success: false,
          message: "Mobile number already exists"
        });
      }
    }

    // Check if email is provided and already exists (excluding current vendor)
    if (email && email.trim()) {
      const existingEmail = await vendorModel.findOne({ email: email.trim(), _id: { $ne: vendorId } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists"
        });
      }
    }

    // Update vendor data
    vendor.ownerName = ownerName;
    vendor.businessName = businessName;
    vendor.mobile = mobile;
    vendor.state = state;
    vendor.city = city;
    vendor.businessCategories = businessCategories;
    vendor.membershipFees = membershipFees;

    // Update email if provided
    if (email && email.trim()) {
      vendor.email = email.trim();
    } else {
      vendor.email = undefined; // Remove email if not provided
    }

    await vendor.save();

    console.log(`[ADMIN] Vendor updated: ${vendor.businessName}`);

    return res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      vendor: {
        _id: vendor._id,
        businessName: vendor.businessName,
        ownerName: vendor.ownerName,
        mobile: vendor.mobile
      }
    });
  } catch (error) {
    console.error('Update vendor error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Toggle vendor active status
const toggleVendorStatus = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await vendorModel.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    // Toggle the isActive status
    vendor.isActive = !vendor.isActive;
    await vendor.save();

    console.log(`[ADMIN] Vendor status toggled: ${vendor.businessName} - ${vendor.isActive ? 'Active' : 'Inactive'}`);

    return res.status(200).json({
      success: true,
      message: `Vendor ${vendor.isActive ? 'activated' : 'deactivated'} successfully`,
      vendor: {
        _id: vendor._id,
        businessName: vendor.businessName,
        isActive: vendor.isActive
      }
    });
  } catch (error) {
    console.error('Toggle vendor status error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete vendor
const deleteVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await vendorModel.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    const businessName = vendor.businessName;

    // Delete the vendor
    await vendorModel.findByIdAndDelete(vendorId);

    // Optionally delete associated certificates
    await VendorCertificate.deleteMany({ vendorId });

    console.log(`[ADMIN] Vendor deleted: ${businessName}`);

    return res.status(200).json({
      success: true,
      message: "Vendor deleted successfully"
    });
  } catch (error) {
    console.error('Delete vendor error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reject vendor
const rejectVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { reason } = req.body;

    const vendor = await vendorModel.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    // Update vendor rejection status
    vendor.isRejected = true;
    vendor.paymentVerified = false;
    vendor.isVerified = false;
    vendor.rejectionReason = reason || 'Application rejected by admin';
    await vendor.save();

    console.log(`[ADMIN] Vendor rejected: ${vendor.businessName}`);

    return res.status(200).json({
      success: true,
      message: "Vendor application rejected successfully",
      vendor: {
        _id: vendor._id,
        businessName: vendor.businessName,
        isRejected: vendor.isRejected
      }
    });
  } catch (error) {
    console.error('Reject vendor error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllVendors,
  approveVendor,
  rejectVendor,
  setVendorPassword,
  createVendor,
  updateVendor,
  toggleVendorStatus,
  deleteVendor
};
