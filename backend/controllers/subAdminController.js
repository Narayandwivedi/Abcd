const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SubAdmin = require("../models/SubAdmin.js");
const Ad = require("../models/Ad");
const path = require("path");
const fs = require("fs");

// SubAdmin login
const subAdminLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or mobile

    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
                     req.headers['x-real-ip'] ||
                     req.ip;
    console.log(`[SUBADMIN LOGIN] Login attempt from IP: ${clientIp}, Identifier: ${identifier}`);

    // Validate input
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Mobile and password are required"
      });
    }

    // Find sub-admin by email or mobile
    const subAdmin = await SubAdmin.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { mobile: identifier }
      ]
    });

    if (!subAdmin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Check if sub-admin is active
    if (!subAdmin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Contact administrator."
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, subAdmin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Update last login
    subAdmin.lastLogin = new Date();
    await subAdmin.save();

    console.log(`[SUBADMIN LOGIN] ✅ Successful login for ${subAdmin.email} from IP: ${clientIp}`);

    // Generate JWT token
    const token = jwt.sign(
      { subAdminId: subAdmin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("subAdminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      subAdmin: {
        _id: subAdmin._id,
        fullName: subAdmin.fullName,
        email: subAdmin.email,
        mobile: subAdmin.mobile,
        permissions: subAdmin.permissions
      }
    });
  } catch (error) {
    console.error("SubAdmin login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// SubAdmin logout
const subAdminLogout = async (req, res) => {
  try {
    res.clearCookie("subAdminToken");
    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error("SubAdmin logout error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get current sub-admin info
const getCurrentSubAdmin = async (req, res) => {
  try {
    const subAdmin = await SubAdmin.findById(req.subAdminId).select("-password");

    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "SubAdmin not found"
      });
    }

    return res.status(200).json({
      success: true,
      subAdmin
    });
  } catch (error) {
    console.error("Get current sub-admin error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Change sub-admin password
const changeSubAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters"
      });
    }

    // Get sub-admin with password
    const subAdmin = await SubAdmin.findById(req.subAdminId);

    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "SubAdmin not found"
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, subAdmin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    subAdmin.password = hashedPassword;
    await subAdmin.save();

    console.log(`[SUBADMIN] Password changed successfully for ${subAdmin.email}`);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Change sub-admin password error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Ad Management Functions

// Ensure ad directory exists
const adDir = path.resolve(__dirname, "..", "uploads", "ad");
if (!fs.existsSync(adDir)) {
  fs.mkdirSync(adDir, { recursive: true });
  console.log("✅ Created ad directory:", adDir);
}

// Get all ads (SubAdmin with permission)
const getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find()
      .populate('vendorId', 'businessName ownerName mobile')
      .sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      ads,
    });
  } catch (error) {
    console.error("Error fetching all ads:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ads",
      error: error.message,
    });
  }
};

// Create new ad (SubAdmin with permission)
const createAd = async (req, res) => {
  try {
    const { vendorId, title, description, link, displayOrder } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Ad image is required",
      });
    }

    // Move file from temp to ad folder
    const uniqueName = `ad-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(req.file.originalname)}`;
    const finalPath = path.join(adDir, uniqueName);

    fs.renameSync(req.file.path, finalPath);

    // Store relative path in database
    const adImgUrl = `/uploads/ad/${uniqueName}`;

    const ad = await Ad.create({
      vendorId: vendorId || null,
      adImg: adImgUrl,
      title,
      description,
      link,
      displayOrder: displayOrder || 0,
      isApproved: true, // Auto-approve subadmin uploads
      isVisible: true,
    });

    const populatedAd = await Ad.findById(ad._id).populate('vendorId', 'businessName ownerName mobile');

    console.log(`[SUBADMIN] Ad created by SubAdmin ID: ${req.subAdminId}`);

    res.status(201).json({
      success: true,
      message: "Ad created successfully",
      ad: populatedAd,
    });
  } catch (error) {
    console.error("Error creating ad:", error);
    // Clean up uploaded file if ad creation fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Failed to create ad",
      error: error.message,
    });
  }
};

// Update ad (SubAdmin with permission)
const updateAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const { vendorId, title, description, link, displayOrder, isApproved, isVisible } = req.body;

    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    // Update image if new one is uploaded
    if (req.file) {
      // Delete old image from filesystem
      if (ad.adImg) {
        const oldImagePath = path.join(__dirname, "..", ad.adImg);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Move new file from temp to ad folder
      const uniqueName = `ad-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(req.file.originalname)}`;
      const finalPath = path.join(adDir, uniqueName);

      fs.renameSync(req.file.path, finalPath);
      ad.adImg = `/uploads/ad/${uniqueName}`;
    }

    // Update fields
    if (vendorId !== undefined) ad.vendorId = vendorId || null;
    if (title !== undefined) ad.title = title;
    if (description !== undefined) ad.description = description;
    if (link !== undefined) ad.link = link;
    if (displayOrder !== undefined) ad.displayOrder = displayOrder;
    if (isApproved !== undefined) ad.isApproved = isApproved;
    if (isVisible !== undefined) ad.isVisible = isVisible;

    await ad.save();

    const updatedAd = await Ad.findById(ad._id).populate('vendorId', 'businessName ownerName mobile');

    console.log(`[SUBADMIN] Ad updated by SubAdmin ID: ${req.subAdminId}`);

    res.status(200).json({
      success: true,
      message: "Ad updated successfully",
      ad: updatedAd,
    });
  } catch (error) {
    console.error("Error updating ad:", error);
    // Clean up uploaded file if update fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Failed to update ad",
      error: error.message,
    });
  }
};

// Delete ad (SubAdmin with permission)
const deleteAd = async (req, res) => {
  try {
    const { adId } = req.params;

    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    // Delete image from filesystem
    if (ad.adImg) {
      const imagePath = path.join(__dirname, "..", ad.adImg);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Ad.findByIdAndDelete(adId);

    console.log(`[SUBADMIN] Ad deleted by SubAdmin ID: ${req.subAdminId}`);

    res.status(200).json({
      success: true,
      message: "Ad deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ad:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete ad",
      error: error.message,
    });
  }
};

// Toggle ad approval (SubAdmin with permission)
const toggleAdApproval = async (req, res) => {
  try {
    const { adId } = req.params;

    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    ad.isApproved = !ad.isApproved;
    await ad.save();

    const updatedAd = await Ad.findById(ad._id).populate('vendorId', 'businessName ownerName mobile');

    console.log(`[SUBADMIN] Ad approval toggled by SubAdmin ID: ${req.subAdminId}`);

    res.status(200).json({
      success: true,
      message: `Ad ${ad.isApproved ? 'approved' : 'unapproved'} successfully`,
      ad: updatedAd,
    });
  } catch (error) {
    console.error("Error toggling ad approval:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle ad approval",
      error: error.message,
    });
  }
};

// Toggle ad visibility (SubAdmin with permission)
const toggleAdVisibility = async (req, res) => {
  try {
    const { adId } = req.params;

    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    ad.isVisible = !ad.isVisible;
    await ad.save();

    const updatedAd = await Ad.findById(ad._id).populate('vendorId', 'businessName ownerName mobile');

    console.log(`[SUBADMIN] Ad visibility toggled by SubAdmin ID: ${req.subAdminId}`);

    res.status(200).json({
      success: true,
      message: `Ad ${ad.isVisible ? 'shown' : 'hidden'} successfully`,
      ad: updatedAd,
    });
  } catch (error) {
    console.error("Error toggling ad visibility:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle ad visibility",
      error: error.message,
    });
  }
};

module.exports = {
  subAdminLogin,
  subAdminLogout,
  getCurrentSubAdmin,
  changeSubAdminPassword,
  getAllAds,
  createAd,
  updateAd,
  deleteAd,
  toggleAdApproval,
  toggleAdVisibility
};
