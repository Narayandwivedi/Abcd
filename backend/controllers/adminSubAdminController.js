const bcrypt = require("bcryptjs");
const SubAdmin = require("../models/SubAdmin.js");

// Get all sub-admins (for admin only)
const getAllSubAdmins = async (req, res) => {
  try {
    const subAdmins = await SubAdmin.find()
      .select('-password')
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      subAdmins
    });
  } catch (error) {
    console.error('Get all sub-admins error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single sub-admin by ID
const getSubAdminById = async (req, res) => {
  try {
    const { subAdminId } = req.params;

    const subAdmin = await SubAdmin.findById(subAdminId)
      .select('-password')
      .populate('createdBy', 'fullName email');

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
    console.error('Get sub-admin by ID error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new sub-admin
const createSubAdmin = async (req, res) => {
  try {
    const { fullName, email, mobile, password, permissions } = req.body;

    // Validate required fields
    if (!fullName || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    // Check if email or mobile already exists
    const existingSubAdmin = await SubAdmin.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingSubAdmin) {
      return res.status(400).json({
        success: false,
        message: "Email or mobile already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new sub-admin
    const newSubAdmin = new SubAdmin({
      fullName,
      email: email.toLowerCase(),
      mobile,
      password: hashedPassword,
      permissions: permissions || {},
      createdBy: req.adminId
    });

    await newSubAdmin.save();

    console.log(`[ADMIN] New SubAdmin created: ${email} by Admin ID: ${req.adminId}`);

    return res.status(201).json({
      success: true,
      message: "SubAdmin created successfully",
      subAdmin: {
        _id: newSubAdmin._id,
        fullName: newSubAdmin.fullName,
        email: newSubAdmin.email,
        mobile: newSubAdmin.mobile,
        permissions: newSubAdmin.permissions,
        isActive: newSubAdmin.isActive
      }
    });
  } catch (error) {
    console.error('Create sub-admin error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update sub-admin
const updateSubAdmin = async (req, res) => {
  try {
    const { subAdminId } = req.params;
    const { fullName, email, mobile, permissions, isActive } = req.body;

    const subAdmin = await SubAdmin.findById(subAdminId);

    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "SubAdmin not found"
      });
    }

    // Check if email or mobile is being changed to an existing one
    if (email && email !== subAdmin.email) {
      const existingEmail = await SubAdmin.findOne({ email, _id: { $ne: subAdminId } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already in use"
        });
      }
      subAdmin.email = email.toLowerCase();
    }

    if (mobile && mobile !== subAdmin.mobile) {
      const existingMobile = await SubAdmin.findOne({ mobile, _id: { $ne: subAdminId } });
      if (existingMobile) {
        return res.status(400).json({
          success: false,
          message: "Mobile already in use"
        });
      }
      subAdmin.mobile = mobile;
    }

    // Update fields
    if (fullName) subAdmin.fullName = fullName;
    if (permissions) subAdmin.permissions = { ...subAdmin.permissions, ...permissions };
    if (typeof isActive !== 'undefined') subAdmin.isActive = isActive;

    await subAdmin.save();

    console.log(`[ADMIN] SubAdmin updated: ${subAdmin.email} by Admin ID: ${req.adminId}`);

    return res.status(200).json({
      success: true,
      message: "SubAdmin updated successfully",
      subAdmin: {
        _id: subAdmin._id,
        fullName: subAdmin.fullName,
        email: subAdmin.email,
        mobile: subAdmin.mobile,
        permissions: subAdmin.permissions,
        isActive: subAdmin.isActive
      }
    });
  } catch (error) {
    console.error('Update sub-admin error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete sub-admin
const deleteSubAdmin = async (req, res) => {
  try {
    const { subAdminId } = req.params;

    const subAdmin = await SubAdmin.findById(subAdminId);

    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "SubAdmin not found"
      });
    }

    await SubAdmin.findByIdAndDelete(subAdminId);

    console.log(`[ADMIN] SubAdmin deleted: ${subAdmin.email} by Admin ID: ${req.adminId}`);

    return res.status(200).json({
      success: true,
      message: "SubAdmin deleted successfully"
    });
  } catch (error) {
    console.error('Delete sub-admin error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Change sub-admin password (by admin)
const changeSubAdminPassword = async (req, res) => {
  try {
    const { subAdminId } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    const subAdmin = await SubAdmin.findById(subAdminId);

    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "SubAdmin not found"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    subAdmin.password = hashedPassword;
    await subAdmin.save();

    console.log(`[ADMIN] SubAdmin password changed for ${subAdmin.email} by Admin ID: ${req.adminId}`);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error('Change sub-admin password error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Toggle sub-admin active status
const toggleSubAdminStatus = async (req, res) => {
  try {
    const { subAdminId } = req.params;

    const subAdmin = await SubAdmin.findById(subAdminId);

    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "SubAdmin not found"
      });
    }

    subAdmin.isActive = !subAdmin.isActive;
    await subAdmin.save();

    console.log(`[ADMIN] SubAdmin status toggled for ${subAdmin.email}: ${subAdmin.isActive} by Admin ID: ${req.adminId}`);

    return res.status(200).json({
      success: true,
      message: `SubAdmin ${subAdmin.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: subAdmin.isActive
    });
  } catch (error) {
    console.error('Toggle sub-admin status error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllSubAdmins,
  getSubAdminById,
  createSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
  changeSubAdminPassword,
  toggleSubAdminStatus
};
