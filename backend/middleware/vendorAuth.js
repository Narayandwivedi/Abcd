const jwt = require("jsonwebtoken");
const vendorModel = require("../models/Vendor.js");

// Middleware to verify vendor authentication
const vendorAuth = async (req, res, next) => {
  try {
    const token = req.cookies.vendorToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const vendor = await vendorModel.findById(decoded.vendorId).select("-password");

    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Vendor not found"
      });
    }

    // Set req.vendor and req.vendorId for use in route handlers
    req.vendor = vendor;
    req.vendorId = vendor._id;
    next();
  } catch (error) {
    console.error("Vendor auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid token"
    });
  }
};

module.exports = vendorAuth;
