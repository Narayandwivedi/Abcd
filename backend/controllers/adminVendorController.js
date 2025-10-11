const BusinessApplication = require("../models/BusinessApplication.js");
const vendorModel = require("../models/Vendor.js");

// Get all pending/under_review business applications
const getPendingApplications = async (req, res) => {
  try {
    const { status } = req.query; // Optional filter by status

    const query = status
      ? { applicationStatus: status }
      : { applicationStatus: { $in: ["pending", "under_review"] } };

    const applications = await BusinessApplication.find(query)
      .populate("vendorId", "email mobile authProvider")
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    console.error("Get pending applications error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: err.message,
    });
  }
};

// Get all applications (with filters)
const getAllApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = status ? { applicationStatus: status } : {};

    const applications = await BusinessApplication.find(query)
      .populate("vendorId", "email mobile businessName authProvider")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await BusinessApplication.countDocuments(query);

    return res.status(200).json({
      success: true,
      applications,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (err) {
    console.error("Get all applications error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: err.message,
    });
  }
};

// Get single application details
const getApplicationDetails = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await BusinessApplication.findById(applicationId)
      .populate("vendorId", "email mobile profilePicture authProvider createdAt")
      .populate("reviewedBy", "name email");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (err) {
    console.error("Get application details error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch application details",
      error: err.message,
    });
  }
};

// Approve business application
const approveApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { adminComments } = req.body;
    const adminId = req.userId; // From admin auth middleware

    const application = await BusinessApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.applicationStatus === "approved") {
      return res.status(400).json({
        success: false,
        message: "Application is already approved",
      });
    }

    // Update application status
    application.applicationStatus = "approved";
    application.adminComments = adminComments || "";
    application.reviewedBy = adminId;
    application.reviewedAt = new Date();
    await application.save();

    // Update vendor verification status
    const vendor = await vendorModel.findById(application.vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Set vendor as verified and link to approved application
    vendor.isVerified = true;
    vendor.approvedApplicationId = application._id;
    await vendor.save();

    console.log('✅ Application approved for vendor:', vendor.email);

    return res.status(200).json({
      success: true,
      message: "Application approved successfully",
      application,
    });
  } catch (err) {
    console.error("Approve application error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to approve application",
      error: err.message,
    });
  }
};

// Reject business application
const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { rejectionReason, adminComments } = req.body;
    const adminId = req.userId; // From admin auth middleware

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const application = await BusinessApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.applicationStatus === "approved") {
      return res.status(400).json({
        success: false,
        message: "Cannot reject an already approved application",
      });
    }

    // Update application status
    application.applicationStatus = "rejected";
    application.rejectionReason = rejectionReason;
    application.adminComments = adminComments || "";
    application.reviewedBy = adminId;
    application.reviewedAt = new Date();
    await application.save();

    console.log('✅ Application rejected for vendor:', application.vendorId);

    return res.status(200).json({
      success: true,
      message: "Application rejected",
      application,
    });
  } catch (err) {
    console.error("Reject application error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to reject application",
      error: err.message,
    });
  }
};

// Update application status (mark as under review)
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, adminComments } = req.body;

    if (!["pending", "under_review"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Use approve or reject endpoints for those actions.",
      });
    }

    const application = await BusinessApplication.findByIdAndUpdate(
      applicationId,
      {
        applicationStatus: status,
        adminComments: adminComments || application.adminComments,
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application status updated",
      application,
    });
  } catch (err) {
    console.error("Update application status error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: err.message,
    });
  }
};

// Get all vendors with their applications
const getAllVendors = async (req, res) => {
  try {
    const { page = 1, limit = 20, verified, hasApplication } = req.query;

    // Build query
    let vendorQuery = {};
    if (verified !== undefined) {
      vendorQuery.isVerified = verified === 'true';
    }
    if (hasApplication !== undefined) {
      vendorQuery.isBusinessApplicationSubmitted = hasApplication === 'true';
    }

    const vendors = await vendorModel.find(vendorQuery)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await vendorModel.countDocuments(vendorQuery);

    // Get applications for each vendor
    const vendorsWithApplications = await Promise.all(
      vendors.map(async (vendor) => {
        const application = await BusinessApplication.findOne({ vendorId: vendor._id })
          .sort({ createdAt: -1 })
          .populate('reviewedBy', 'name email');

        return {
          ...vendor.toObject(),
          application,
        };
      })
    );

    return res.status(200).json({
      success: true,
      vendors: vendorsWithApplications,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    });
  } catch (err) {
    console.error("Get all vendors error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendors",
      error: err.message,
    });
  }
};

// Get single vendor with application details
const getVendorWithApplication = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await vendorModel.findById(vendorId).select('-password');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Get vendor's latest application
    const application = await BusinessApplication.findOne({ vendorId })
      .sort({ createdAt: -1 })
      .populate('reviewedBy', 'name email');

    return res.status(200).json({
      success: true,
      vendor,
      application,
    });
  } catch (err) {
    console.error("Get vendor with application error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor details",
      error: err.message,
    });
  }
};

// Quick approve vendor by vendorId (finds latest application and approves)
const quickApproveVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { adminComments } = req.body;
    const adminId = req.userId;

    // Find vendor
    const vendor = await vendorModel.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Find latest application for this vendor
    const application = await BusinessApplication.findOne({
      vendorId,
      applicationStatus: { $in: ["pending", "under_review"] }
    }).sort({ createdAt: -1 });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "No pending application found for this vendor",
      });
    }

    // Approve application
    application.applicationStatus = "approved";
    application.adminComments = adminComments || "";
    application.reviewedBy = adminId;
    application.reviewedAt = new Date();
    await application.save();

    // Verify vendor
    vendor.isVerified = true;
    vendor.approvedApplicationId = application._id;
    await vendor.save();

    console.log('✅ Vendor approved (quick approve):', vendor.email);

    return res.status(200).json({
      success: true,
      message: "Vendor approved successfully",
      vendor: { ...vendor.toObject(), password: undefined },
      application,
    });
  } catch (err) {
    console.error("Quick approve vendor error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to approve vendor",
      error: err.message,
    });
  }
};

// Quick reject vendor by vendorId
const quickRejectVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { rejectionReason, adminComments } = req.body;
    const adminId = req.userId;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    // Find latest pending application
    const application = await BusinessApplication.findOne({
      vendorId,
      applicationStatus: { $in: ["pending", "under_review"] }
    }).sort({ createdAt: -1 });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "No pending application found for this vendor",
      });
    }

    // Reject application
    application.applicationStatus = "rejected";
    application.rejectionReason = rejectionReason;
    application.adminComments = adminComments || "";
    application.reviewedBy = adminId;
    application.reviewedAt = new Date();
    await application.save();

    console.log('✅ Vendor rejected (quick reject):', vendorId);

    return res.status(200).json({
      success: true,
      message: "Vendor application rejected",
      application,
    });
  } catch (err) {
    console.error("Quick reject vendor error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to reject vendor",
      error: err.message,
    });
  }
};

module.exports = {
  getPendingApplications,
  getAllApplications,
  getApplicationDetails,
  approveApplication,
  rejectApplication,
  updateApplicationStatus,
  getAllVendors,
  getVendorWithApplication,
  quickApproveVendor,
  quickRejectVendor,
};
