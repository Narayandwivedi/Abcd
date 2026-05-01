const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const vendorModel = require("../models/Vendor.js");
const VendorCertificate = require("../models/VendorCertificate.js");
const VendorApplication = require("../models/VendorApplication.js");
const { generateVendorCertificatePDF } = require("../utils/generateVendorCertificate.js");
const { handleVendorPhotoUpload, handlePaymentScreenshotUpload } = require("./uploadController");

const normalizeWebsiteUrl = (value) => {
  if (!value || typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

// Get all vendors (for admin)
const getAllVendors = async (req, res) => {
  try {
    const vendors = await vendorModel.find()
      .select('-password -__v')
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
    vendor.referralCode = certificateData.referralCode || certificate.certificateNumber;
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
        paymentVerified: vendor.paymentVerified,
        referralCode: vendor.referralCode
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
    let {
      ownerName,
      owners,
      businessName,
      mobile,
      email,
      state,
      district,
      city,
      businessCategories,
      membershipFees,
      password,
      websiteUrl,
      socialUrl,
      gstPan,
      address,
      referredByName,
      referralId,
      membershipType,
      amountPaid,
      utrNumber,
      applicationNumber
    } = req.body;

    if (typeof businessCategories === 'string') {
      try {
        businessCategories = JSON.parse(businessCategories);
      } catch (e) {
        return res.status(400).json({ success: false, message: "Invalid business categories format" });
      }
    }

    if (typeof owners === 'string') {
      try {
        owners = JSON.parse(owners);
      } catch (e) {
        return res.status(400).json({ success: false, message: "Invalid owners format" });
      }
    }

    email = email?.trim();
    ownerName = ownerName?.trim();
    businessName = businessName?.trim();
    state = state?.trim();
    district = district?.trim();
    city = city?.trim();
    membershipFees = Number(membershipFees);
    websiteUrl = normalizeWebsiteUrl(websiteUrl);
    socialUrl = socialUrl?.trim();
    gstPan = gstPan?.trim();
    address = address?.trim();
    referredByName = referredByName?.trim();
    referralId = referralId?.trim();
    utrNumber = utrNumber?.trim();
    membershipType = membershipType?.trim();
    amountPaid = amountPaid ? Number(amountPaid) : undefined;

    if (!Array.isArray(owners) || owners.length === 0) {
      owners = ownerName ? [{ name: ownerName }] : [];
    }

    owners = owners.map((item) => ({
      name: (item?.name || item?.ownerName || '').trim()
    })).filter((item) => item.name);

    if (!mobile || owners.length === 0 || !businessName || !state || !district || !city || !businessCategories || !Array.isArray(businessCategories) || businessCategories.length === 0 || !membershipFees || isNaN(membershipFees) || membershipFees <= 0) {
      return res.status(400).json({
        success: false,
        message: "Mobile, at least one owner, business name, state, district, city, at least one category-subcategory pair, and membership fees are required"
      });
    }

    if (owners.length > 10) {
      return res.status(400).json({ success: false, message: "Maximum 10 owners are allowed" });
    }

    // Count total subcategories across all categories
    let totalSubCategories = 0;
    for (const item of businessCategories) {
      if (!item.category || !Array.isArray(item.subCategories) || item.subCategories.length === 0) {
        return res.status(400).json({ success: false, message: "Each category must have a name and at least one subcategory" });
      }
      totalSubCategories += item.subCategories.length;
      
      item.category = item.category.trim();
      if (item.categoryId) item.categoryId = item.categoryId.trim();
      
      item.subCategories = item.subCategories.map(sub => ({
        name: sub.name?.trim(),
        id: sub.id?.trim()
      })).filter(sub => sub.name);
    }

    if (totalSubCategories > 5) {
      return res.status(400).json({ success: false, message: "Maximum 5 subcategories allowed across all categories" });
    }

    mobile = Number(mobile);

    if (!mobile || mobile < 6000000000 || mobile > 9999999999) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Indian mobile number",
      });
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
      ownerName: owners[0].name,
      businessName,
      mobile,
      state,
      district,
      city,
      businessCategories,
      membershipFees,
      paymentVerified: true,
      isVerified: true,
      isMobileVerified: true,
      isBusinessApplicationSubmitted: true,
    };

    // Only add email if it's provided and not empty
    if (email && email.trim()) {
      vendorData.email = email.trim();
    }

    if (websiteUrl) vendorData.websiteUrl = websiteUrl;
    if (socialUrl) vendorData.socialUrl = socialUrl;
    if (gstPan) vendorData.gstPan = gstPan;
    if (address) vendorData.address = address;
    if (referredByName) vendorData.referredByName = referredByName;
    if (referralId) vendorData.referralId = referralId;
    if (utrNumber) vendorData.utrNumber = utrNumber;
    if (membershipType) vendorData.membershipType = membershipType;
    if (amountPaid) vendorData.amountPaid = amountPaid;
    if (applicationNumber) vendorData.applicationNumber = applicationNumber;

    // Hash password if provided
    if (password && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      vendorData.password = await bcrypt.hash(password, salt);
    }

    const ownerPhotoFiles = (req.files && req.files.ownerPhotos) ? req.files.ownerPhotos : [];
    const legacyVendorPhotoFiles = (req.files && req.files.vendorPhoto) ? req.files.vendorPhoto : [];
    const normalizedOwnerPhotoFiles = ownerPhotoFiles.length > 0 ? ownerPhotoFiles : legacyVendorPhotoFiles;

    try {
      const ownersWithPhotos = [];
      let photoIndex = 0;
      for (let i = 0; i < owners.length; i++) {
        let photoPath = null;
        // If frontend appends photos, we'll try to match them. Since we removed the requirement
        // we just map available photos sequentially, or null if none available.
        if (normalizedOwnerPhotoFiles && photoIndex < normalizedOwnerPhotoFiles.length) {
          photoPath = await handleVendorPhotoUpload(normalizedOwnerPhotoFiles[photoIndex]);
          photoIndex++;
        }
        ownersWithPhotos.push({
          name: owners[i].name,
          photo: photoPath
        });
      }
      vendorData.owners = ownersWithPhotos;
      if (ownersWithPhotos.length > 0 && ownersWithPhotos[0].photo) {
        vendorData.passportPhoto = ownersWithPhotos[0].photo;
      }
    } catch (error) {
      console.error("Owner photo upload error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to upload owner photos"
      });
    }

    if (utrNumber && !/^\d{12}$/.test(utrNumber)) {
      return res.status(400).json({
        success: false,
        message: "UTR number must be exactly 12 digits"
      });
    }

    const hasPaymentScreenshot = !!(req.files && req.files.paymentScreenshot && req.files.paymentScreenshot[0]);
    if (hasPaymentScreenshot) {
      try {
        vendorData.paymentScreenshot = await handlePaymentScreenshotUpload(req.files.paymentScreenshot[0]);
      } catch (error) {
        console.error("Payment screenshot upload error:", error);
        return res.status(500).json({
          success: false,
          message: error.message || "Failed to upload payment screenshot"
        });
      }
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
    vendor.referralCode = certificateData.referralCode || certificate.certificateNumber;
    await vendor.save();

    // If applicationNumber is provided, mark the application as approved
    if (applicationNumber) {
      await VendorApplication.findOneAndUpdate(
        { applicationNumber: applicationNumber },
        { status: 'approved' }
      );
    }

    console.log(`[ADMIN] Vendor created with certificate: ${vendor.businessName} - ${certificate.certificateNumber}`);

    return res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      vendor: {
        _id: vendor._id,
        businessName: vendor.businessName,
        ownerName: vendor.ownerName,
        mobile: vendor.mobile,
        referralCode: vendor.referralCode
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
    let { ownerName, businessName, mobile, email, state, district, city, businessCategories, membershipFees, owners, utrNumber, password, membershipType } = req.body;

    // Handle stringified JSON from FormData
    if (typeof businessCategories === 'string') {
      try {
        businessCategories = JSON.parse(businessCategories);
      } catch (e) {
        console.error("Error parsing businessCategories:", e);
      }
    }
    if (typeof owners === 'string') {
      try {
        owners = JSON.parse(owners);
      } catch (e) {
        console.error("Error parsing owners:", e);
      }
    }

    // Validate required fields
    if (!ownerName || !businessName || !mobile || !state || !district || !city || !businessCategories || !Array.isArray(businessCategories) || businessCategories.length === 0 || !membershipFees) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided including state, district, city, at least one category and subcategory"
      });
    }

    // Count total subcategories across all categories
    let totalSubCategories = 0;
    for (const item of businessCategories) {
      if (!item.category || !Array.isArray(item.subCategories) || item.subCategories.length === 0) {
        return res.status(400).json({ success: false, message: "Each category must have a name and at least one subcategory" });
      }
      totalSubCategories += item.subCategories.length;
    }

    if (totalSubCategories > 5) {
      return res.status(400).json({ success: false, message: "Maximum 5 subcategories allowed across all categories" });
    }

    const vendor = await vendorModel.findById(vendorId).populate('activeCertificate');

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
    vendor.district = district;
    vendor.city = city;
    vendor.businessCategories = businessCategories;
    vendor.membershipFees = membershipFees;
    
    if (utrNumber) vendor.utrNumber = utrNumber;
    if (membershipType) vendor.membershipType = membershipType;

    // Hash password if provided
    if (password && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      vendor.password = await bcrypt.hash(password, salt);
    }

    // Handle Owners and Photos
    if (owners && Array.isArray(owners)) {
      const ownerPhotoFiles = (req.files && req.files.ownerPhotos) ? req.files.ownerPhotos : [];
      const legacyVendorPhotoFiles = (req.files && req.files.vendorPhoto) ? req.files.vendorPhoto : [];
      const normalizedOwnerPhotoFiles = ownerPhotoFiles.length > 0 ? ownerPhotoFiles : legacyVendorPhotoFiles;

      const updatedOwners = [];
      let photoIndex = 0;
      
      for (let i = 0; i < owners.length; i++) {
        let photoPath = vendor.owners[i]?.photo || null; // Keep existing photo by default
        
        // If a new photo is provided for this owner, upload it
        // Note: The frontend sends new photos in normalizedOwnerPhotoFiles.
        // We match them by index of owners that have a new photo.
        // But for simplicity, if any photo is sent, we take the next one.
        if (normalizedOwnerPhotoFiles && photoIndex < normalizedOwnerPhotoFiles.length) {
          try {
            photoPath = await handleVendorPhotoUpload(normalizedOwnerPhotoFiles[photoIndex]);
            photoIndex++;
          } catch (error) {
            console.error("Error uploading owner photo:", error);
          }
        }
        
        updatedOwners.push({
          name: owners[i].name,
          photo: photoPath
        });
      }
      vendor.owners = updatedOwners;
      if (updatedOwners.length > 0 && updatedOwners[0].photo) {
        vendor.passportPhoto = updatedOwners[0].photo;
      }
    }

    // Handle Payment Screenshot
    const hasPaymentScreenshot = !!(req.files && req.files.paymentScreenshot && req.files.paymentScreenshot[0]);
    if (hasPaymentScreenshot) {
      try {
        vendor.paymentScreenshot = await handlePaymentScreenshotUpload(req.files.paymentScreenshot[0]);
      } catch (error) {
        console.error("Payment screenshot upload error:", error);
      }
    }

    // Update email if provided
    if (email && email.trim()) {
      vendor.email = email.trim();
    } else {
      vendor.email = undefined; // Remove email if not provided
    }

    await vendor.save();

    let certificateRegenerated = false;
    let regeneratedCertificateLink = null;

    // On vendor edit, regenerate certificate PDF with same certificate number and same referral code
    if (vendor.activeCertificate) {
      const activeCertificate = vendor.activeCertificate;

      // Delete old certificate PDF file if it exists
      if (activeCertificate.downloadLink) {
        const oldCertificatePath = path.join(__dirname, '..', activeCertificate.downloadLink);
        if (fs.existsSync(oldCertificatePath)) {
          fs.unlinkSync(oldCertificatePath);
          console.log(`[ADMIN] Deleted old vendor certificate PDF: ${oldCertificatePath}`);
        }
      }

      // Keep same referral code; regenerate PDF with same certificate number and updated vendor details
      const certificateData = await generateVendorCertificatePDF(vendor, activeCertificate.certificateNumber);

      activeCertificate.downloadLink = certificateData.downloadLink;
      activeCertificate.pdfDeleted = false;
      await activeCertificate.save();

      certificateRegenerated = true;
      regeneratedCertificateLink = activeCertificate.downloadLink;
      console.log(`[ADMIN] Vendor certificate regenerated: ${vendor.businessName} - ${activeCertificate.certificateNumber}`);
    }

    console.log(`[ADMIN] Vendor updated: ${vendor.businessName}`);

    return res.status(200).json({
      success: true,
      message: certificateRegenerated
        ? "Vendor updated successfully and certificate regenerated"
        : "Vendor updated successfully",
      vendor: {
        _id: vendor._id,
        businessName: vendor.businessName,
        ownerName: vendor.ownerName,
        mobile: vendor.mobile
      },
      certificateRegenerated,
      certificateDownloadLink: regeneratedCertificateLink
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
