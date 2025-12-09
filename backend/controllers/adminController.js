const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const userModel = require("../models/User.js");
const Admin = require("../models/Admin.js");
const Certificate = require("../models/Certificate.js");
const { generateCertificatePDF, regenerateCertificatePDF } = require("../utils/generateCertificate.js");

// Get all users (for admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find()
      .select('-password')
      .populate('activeCertificate', 'certificateNumber downloadLink issueDate expiryDate renewalCount pdfDeleted')
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

    // Create new certificate document
    const certificate = new Certificate({
      certificateNumber: certificateData.certificateNumber,
      userId: user._id,
      downloadLink: certificateData.downloadLink,
      issueDate: certificateData.issueDate,
      expiryDate: certificateData.expiryDate,
      renewalCount: 0
    });

    await certificate.save();

    // Update user with certificate reference and referral code
    user.paymentVerified = true;
    user.isVerified = true;
    user.isRejected = false; // Clear rejection status if re-approving
    user.rejectionReason = undefined; // Clear rejection reason
    user.activeCertificate = certificate._id;
    user.referralCode = certificateData.referralCode;
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
        certificateNumber: certificate.certificateNumber,
        certificateDownloadLink: certificate.downloadLink,
        referralCode: user.referralCode
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

// Renew user certificate
const renewCertificate = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId).populate('activeCertificate');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.activeCertificate) {
      return res.status(400).json({
        success: false,
        message: "User has no active certificate to renew"
      });
    }

    const oldCertificate = user.activeCertificate;

    // Delete old PDF file from filesystem
    const oldFilePath = path.join(__dirname, '..', oldCertificate.downloadLink);
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }

    // Mark old certificate as PDF deleted (keep the record for history)
    oldCertificate.pdfDeleted = true;
    await oldCertificate.save();

    // Generate new certificate PDF
    const certificateData = await generateCertificatePDF(user);

    // Create new certificate document with incremented renewal count
    const newCertificate = new Certificate({
      certificateNumber: certificateData.certificateNumber,
      userId: user._id,
      downloadLink: certificateData.downloadLink,
      issueDate: certificateData.issueDate,
      expiryDate: certificateData.expiryDate,
      renewalCount: oldCertificate.renewalCount + 1,
      pdfDeleted: false
    });

    await newCertificate.save();

    // Update user's active certificate reference
    user.activeCertificate = newCertificate._id;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Certificate renewed successfully",
      certificate: {
        certificateNumber: newCertificate.certificateNumber,
        downloadLink: newCertificate.downloadLink,
        renewalCount: newCertificate.renewalCount,
        issueDate: newCertificate.issueDate,
        expiryDate: newCertificate.expiryDate
      },
      previousCertificate: {
        certificateNumber: oldCertificate.certificateNumber,
        renewalCount: oldCertificate.renewalCount
      }
    });
  } catch (error) {
    console.error('Renew certificate error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Find user with populated certificate
    const user = await userModel.findById(userId).populate('activeCertificate');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Fields that can be updated
    const allowedFields = [
      'fullName',
      'mobile',
      'email',
      'gotra',
      'city',
      'address',
      'relativeName',
      'relationship',
      'profilePicture',
      'passportPhoto',
      'utrNumber',
      'referredBy'
    ];

    // Certificate-relevant fields that trigger certificate regeneration
    const certificateFields = ['fullName', 'gotra', 'city', 'relativeName', 'relationship'];

    // Check if any certificate-relevant field is being changed
    let certificateNeedsRegeneration = false;
    if (user.paymentVerified && user.activeCertificate) {
      certificateNeedsRegeneration = certificateFields.some(field => {
        return updateData[field] !== undefined && updateData[field] !== user[field];
      });
    }

    // Update only allowed fields
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    await user.save();

    // Regenerate certificate if needed
    if (certificateNeedsRegeneration && user.activeCertificate) {
      try {
        const oldCertificate = user.activeCertificate;

        // Delete old PDF file from filesystem
        const oldFilePath = path.join(__dirname, '..', oldCertificate.downloadLink);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log(`[ADMIN] Deleted old certificate PDF: ${oldFilePath}`);
        }

        // Regenerate certificate PDF with the same certificate number
        const certificateData = await regenerateCertificatePDF(user, oldCertificate.certificateNumber);

        // Update certificate document with new download link
        oldCertificate.downloadLink = certificateData.downloadLink;
        oldCertificate.pdfDeleted = false; // Mark as not deleted since we just created a new one
        await oldCertificate.save();

        console.log(`[ADMIN] Certificate regenerated for user ${user.fullName} with certificate number ${oldCertificate.certificateNumber}`);
      } catch (certError) {
        console.error('Certificate regeneration error:', certError);
        // Don't fail the entire update if certificate regeneration fails
        // Just log the error and continue
      }
    }

    // Return updated user without password
    const updatedUser = await userModel.findById(userId)
      .select('-password')
      .populate('activeCertificate', 'certificateNumber downloadLink issueDate expiryDate renewalCount pdfDeleted');

    return res.status(200).json({
      success: true,
      message: certificateNeedsRegeneration
        ? "User updated successfully and certificate regenerated"
        : "User updated successfully",
      user: updatedUser,
      certificateRegenerated: certificateNeedsRegeneration
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user
    const user = await userModel.findById(userId).populate('activeCertificate');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Delete associated certificate PDF if exists
    if (user.activeCertificate && !user.activeCertificate.pdfDeleted) {
      const certificatePath = path.join(__dirname, '..', user.activeCertificate.downloadLink);
      if (fs.existsSync(certificatePath)) {
        fs.unlinkSync(certificatePath);
      }
    }

    // Delete profile picture if exists
    if (user.profilePicture) {
      const profilePicPath = path.join(__dirname, '..', user.profilePicture);
      if (fs.existsSync(profilePicPath)) {
        fs.unlinkSync(profilePicPath);
      }
    }

    // Delete passport photo if exists
    if (user.passportPhoto) {
      const passportPhotoPath = path.join(__dirname, '..', user.passportPhoto);
      if (fs.existsSync(passportPhotoPath)) {
        fs.unlinkSync(passportPhotoPath);
      }
    }

    // Delete payment screenshot if exists
    if (user.paymentScreenshot) {
      const paymentScreenshotPath = path.join(__dirname, '..', user.paymentScreenshot);
      if (fs.existsSync(paymentScreenshotPath)) {
        fs.unlinkSync(paymentScreenshotPath);
      }
    }

    // Delete all certificates associated with user
    if (user.activeCertificate) {
      await Certificate.deleteMany({ userId: user._id });
    }

    // Delete user from database
    await userModel.findByIdAndDelete(userId);

    console.log(`[ADMIN] User deleted: ${user.fullName} (${user.email})`);

    return res.status(200).json({
      success: true,
      message: "User and associated data deleted successfully"
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create user (admin) - bypasses payment requirement
const createUser = async (req, res) => {
  try {
    const { fullName, mobile, email, gotra, city, address, relativeName, relationship, referredBy, password } = req.body;

    // Validate required fields
    if (!fullName || !mobile || !gotra || !address || !relativeName) {
      return res.status(400).json({
        success: false,
        message: "Full name, mobile, gotra, address, and relative name are required"
      });
    }

    // Validate passport photo is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Passport photo is required"
      });
    }

    // Check if user already exists by mobile or email
    const existingUser = await userModel.findOne({
      $or: [
        { mobile },
        ...(email ? [{ email }] : [])
      ]
    });

    if (existingUser) {
      if (existingUser.mobile === mobile) {
        return res.status(400).json({
          success: false,
          message: "User with this mobile number already exists"
        });
      }
      if (email && existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists"
        });
      }
    }

    // Process passport photo upload
    const { handlePassportPhotoUpload } = require("../controllers/uploadController");
    const passportPhotoPath = await handlePassportPhotoUpload(req.file);

    // Create user data
    const userData = {
      fullName: fullName.toUpperCase(),
      mobile,
      gotra,
      address: address.toUpperCase(),
      relativeName: relativeName.toUpperCase(),
      relationship: relationship || 'S/O',
      passportPhoto: passportPhotoPath,
      paymentVerified: true,  // Admin-created users are auto-verified
      isVerified: true
    };

    // Add optional fields if provided
    if (email) {
      userData.email = email;
    }

    if (city) {
      userData.city = city.toUpperCase();
    }

    if (referredBy) {
      userData.referredBy = referredBy.trim().toUpperCase();
    }

    // Hash password if provided
    if (password && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(password, salt);
    }

    // Create user
    const user = await userModel.create(userData);

    // Generate certificate automatically
    const certificateData = await generateCertificatePDF(user);

    // Create certificate document
    const certificate = new Certificate({
      certificateNumber: certificateData.certificateNumber,
      userId: user._id,
      downloadLink: certificateData.downloadLink,
      issueDate: certificateData.issueDate,
      expiryDate: certificateData.expiryDate,
      renewalCount: 0
    });

    await certificate.save();

    // Update user with certificate reference and referral code
    user.activeCertificate = certificate._id;
    user.referralCode = certificateData.referralCode;
    await user.save();

    console.log(`[ADMIN] User created: ${user.fullName} (${user.mobile})`);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        mobile: user.mobile,
        email: user.email,
        certificateNumber: certificate.certificateNumber,
        referralCode: user.referralCode
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reject user
const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update user rejection status
    user.isRejected = true;
    user.paymentVerified = false;
    user.isVerified = false;
    user.rejectionReason = reason || 'Application rejected by admin';
    await user.save();

    console.log(`[ADMIN] User rejected: ${user.fullName}`);

    return res.status(200).json({
      success: true,
      message: "User application rejected successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        isRejected: user.isRejected
      }
    });
  } catch (error) {
    console.error('Reject user error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Toggle user active status
const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Toggle the isActive status
    user.isActive = !user.isActive;
    await user.save();

    console.log(`[ADMIN] User status toggled: ${user.fullName} - ${user.isActive ? 'Active' : 'Inactive'}`);

    return res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        _id: user._id,
        fullName: user.fullName,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  approveUser,
  rejectUser,
  toggleUserStatus,
  setUserPassword,
  adminLogin,
  adminLogout,
  getCurrentAdmin,
  changeAdminPassword,
  renewCertificate,
  updateUser,
  deleteUser,
  createUser
};
