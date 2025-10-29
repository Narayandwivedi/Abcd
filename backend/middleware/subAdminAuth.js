const jwt = require("jsonwebtoken");
const SubAdmin = require("../models/SubAdmin.js");

// Middleware to verify sub-admin authentication
const subAdminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.subAdminToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const subAdmin = await SubAdmin.findById(decoded.subAdminId);

    if (!subAdmin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - SubAdmin not found"
      });
    }

    // Check if sub-admin is active
    if (!subAdmin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Account is deactivated"
      });
    }

    // Set req.subAdmin and req.subAdminId for use in route handlers
    req.subAdmin = subAdmin;
    req.subAdminId = subAdmin._id;
    next();
  } catch (error) {
    console.error("SubAdmin auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid token"
    });
  }
};

// Middleware to check specific permissions
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.subAdmin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (!req.subAdmin.permissions[permission]) {
      return res.status(403).json({
        success: false,
        message: `Forbidden - You don't have permission to ${permission}`
      });
    }

    next();
  };
};

module.exports = { subAdminAuth, checkPermission };
