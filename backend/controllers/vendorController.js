const vendorModel = require("../models/Vendor.js");

// Submit/Update Vendor Business Form
const submitBusinessForm = async (req, res) => {
  try {
    const vendorId = req.vendorId; // From auth middleware

    // Check if vendor has already submitted the form
    const existingVendorCheck = await vendorModel.findById(vendorId);
    if (existingVendorCheck && existingVendorCheck.isBusinessFormCompleted === true) {
      return res.status(403).json({
        success: false,
        message: "Business form has already been submitted. You cannot submit again.",
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
    } = req.body;

    // Validation - require key business information
    if (!businessName || !ownerName || !mobile || !gstNumber) {
      return res.status(400).json({
        success: false,
        message: "Business name, owner name, mobile, and GST number are required",
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

    // Check if mobile or GST is already used by another vendor
    const existingVendor = await vendorModel.findOne({
      _id: { $ne: vendorId },
      $or: [
        { mobile: mobile },
        ...(gstNumber ? [{ gstNumber: gstNumber }] : [])
      ]
    });

    if (existingVendor) {
      if (existingVendor.mobile === mobile) {
        return res.status(400).json({
          success: false,
          message: "Mobile number already registered by another vendor",
        });
      }
      if (gstNumber && existingVendor.gstNumber === gstNumber) {
        return res.status(400).json({
          success: false,
          message: "GST number already registered by another vendor",
        });
      }
    }

    // Prepare update data
    const updateData = {
      businessName,
      ownerName,
      mobile,
      gstNumber,
      businessCategory,
      isBusinessFormCompleted: true,
      isMobileVerified: false, // Reset mobile verification if mobile changed
    };

    // Add business address with hardcoded Chhattisgarh state
    if (businessAddress) {
      updateData.businessAddress = {
        ...businessAddress,
        state: "Chhattisgarh" // Hardcoded - only Chhattisgarh allowed
      };
    }

    // Add optional fields if provided
    if (bankAccount) updateData.bankAccount = bankAccount;
    if (upiId) updateData.upiId = upiId;

    // Update vendor
    const updatedVendor = await vendorModel.findByIdAndUpdate(
      vendorId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedVendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    console.log('✅ Business form submitted successfully for:', updatedVendor.businessName);

    return res.status(200).json({
      success: true,
      message: "Business information submitted successfully",
      vendorData: updatedVendor,
    });
  } catch (err) {
    console.error("Business form submission error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to submit business form",
      error: err.message,
    });
  }
};

// Get current vendor details
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

    return res.status(200).json({
      success: true,
      vendorData: vendor,
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

module.exports = {
  submitBusinessForm,
  getVendorDetails,
};
