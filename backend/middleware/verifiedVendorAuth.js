const jwt = require("jsonwebtoken");
const vendorModel = require("../models/Vendor.js");

// Middleware to verify that vendor is authenticated AND verified
const verifiedVendorAuth = async (req, res, next) => {
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

    // Check if vendor is verified (business application approved)
    if (!vendor.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Access denied - Your business application is pending admin approval",
        isVerified: false,
      });
    }

    // Set req.vendor and req.vendorId for use in route handlers
    req.vendor = vendor;
    req.vendorId = vendor._id;
    next();
  } catch (error) {
    console.error("Verified vendor auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid token"
    });
  }
};

module.exports = verifiedVendorAuth;
