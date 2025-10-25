const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin.js");

// Middleware to verify admin authentication
const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Admin not found"
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Account is deactivated"
      });
    }

    // Set req.admin and req.adminId for use in route handlers
    req.admin = admin;
    req.adminId = admin._id;
    next();
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid token"
    });
  }
};

module.exports = adminAuth;
