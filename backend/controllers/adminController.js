const bcrypt = require("bcryptjs");
const userModel = require("../models/User.js");
const { generateCertificatePDF } = require("../utils/generateCertificate.js");

// Get all users (for admin)
const getAllUsers = async (req, res) => {
  try {
    // TODO: Uncomment when auth middleware is added
    // Check if user is admin
    // if (!req.user || req.user.role !== 'admin') {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Access denied. Admin only."
    //   });
    // }

    const users = await userModel.find({ role: 'user' })
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
    // TODO: Uncomment when auth middleware is added
    // Check if user is admin
    // if (!req.user || req.user.role !== 'admin') {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Access denied. Admin only."
    //   });
    // }

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
    // TODO: Uncomment when auth middleware is added
    // Check if user is admin
    // if (!req.user || req.user.role !== 'admin') {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Access denied. Admin only."
    //   });
    // }

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

module.exports = {
  getAllUsers,
  approveUser,
  setUserPassword
};
