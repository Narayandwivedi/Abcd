const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SubAdmin = require("../models/SubAdmin.js");

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

module.exports = {
  subAdminLogin,
  subAdminLogout,
  getCurrentSubAdmin,
  changeSubAdminPassword
};
