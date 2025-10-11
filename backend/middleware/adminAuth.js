const jwt = require("jsonwebtoken");
const userModel = require("../models/User.js");

// Middleware to verify admin authentication
const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not found"
      });
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Admin access required"
      });
    }

    // Set req.user and req.userId for use in route handlers
    req.user = user;
    req.userId = user._id;
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
