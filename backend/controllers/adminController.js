const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/User.js");
const Admin = require("../models/Admin.js");
const { generateCertificatePDF } = require("../utils/generateCertificate.js");

// Get all users (for admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find()
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Approve user
const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate certificate PDF
    const certificateData = await generateCertificatePDF(user);

    // Update payment verification status and certificate details
    user.paymentVerified = true;
    user.isVerified = true;
    user.certificateNumber = certificateData.certificateNumber;
    user.certificateDownloadLink = certificateData.downloadLink;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User approved successfully and certificate generated",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        paymentVerified: user.paymentVerified,
        certificateNumber: user.certificateNumber,
        certificateDownloadLink: user.certificateDownloadLink
      }
    });
  } catch (error) {
    console.error('Approve user error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Set password for user
const setUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password set successfully"
    });
  } catch (error) {
    console.error('Set password error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or mobile

    // Log the client IP for debugging
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
                     req.headers['x-real-ip'] ||
                     req.ip;
    console.log(`[ADMIN LOGIN] Login attempt from IP: ${clientIp}, Identifier: ${identifier}`);

    // Validate input
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Mobile and password are required"
      });
    }

    // Find admin by email or mobile
    const admin = await Admin.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { mobile: identifier }
      ]
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Contact system administrator."
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    console.log(`[ADMIN LOGIN] ✅ Successful login for ${admin.email} from IP: ${clientIp}`);

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      admin: {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        mobile: admin.mobile
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin logout
const adminLogout = async (req, res) => {
  try {
    res.clearCookie("adminToken");
    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Admin logout error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get current admin info
const getCurrentAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    return res.status(200).json({
      success: true,
      admin
    });
  } catch (error) {
    console.error("Get current admin error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Change admin password
const changeAdminPassword = async (req, res) => {
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

    // Get admin with password
    const admin = await Admin.findById(req.adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    admin.password = hashedPassword;
    await admin.save();

    console.log(`[ADMIN] Password changed successfully for ${admin.email}`);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Change admin password error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  approveUser,
  setUserPassword,
  adminLogin,
  adminLogout,
  getCurrentAdmin,
  changeAdminPassword
};
