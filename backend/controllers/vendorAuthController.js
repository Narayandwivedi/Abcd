const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const vendorModel = require("../models/Vendor.js");

const handleVendorSignup = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "missing data" });
    }

    let {
      businessName,
      ownerName,
      email,
      mobile,
      password,
      gstNumber,
      businessCategory,
      businessAddress
    } = req.body;

    // Trim input fields
    businessName = businessName?.trim();
    ownerName = ownerName?.trim();
    email = email?.trim();
    password = password?.trim();
    gstNumber = gstNumber?.trim();
    businessCategory = businessCategory?.trim();

    if (!businessName || !ownerName || !email || !mobile || !password || !gstNumber || !businessCategory) {
      return res.status(400).json({ success: false, message: "missing required fields" });
    }

    // Validate Indian mobile number
    if (mobile < 6000000000 || mobile > 9999999999) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Indian mobile number",
      });
    }

    // Validate GST number format (15 characters)
    if (gstNumber.length !== 15) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid GST number (15 characters)",
      });
    }

    // Check if vendor already exists by email, mobile, or GST number
    const existingVendor = await vendorModel.findOne({
      $or: [{ email }, { mobile }, { gstNumber }]
    });

    if (existingVendor) {
      if (existingVendor.email === email) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
      if (existingVendor.mobile === mobile) {
        return res.status(400).json({
          success: false,
          message: "Mobile number already exists",
        });
      }
      if (existingVendor.gstNumber === gstNumber) {
        return res.status(400).json({
          success: false,
          message: "GST number already registered",
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);

    const newVendorData = {
      businessName,
      ownerName,
      email,
      password: hashedPassword,
      mobile,
      gstNumber,
      businessCategory,
      businessAddress: businessAddress || {},
    };

    // Create new vendor
    const newVendor = await vendorModel.create(newVendorData);

    // Generate JWT token
    const token = jwt.sign(
      { vendorId: newVendor._id, role: "vendor" },
      process.env.JWT_SECRET
    );

    res.cookie("vendorToken", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    // Remove password before sending response
    const vendorObj = newVendor.toObject();
    delete vendorObj.password;

    return res.status(201).json({
      success: true,
      message: "Vendor registered successfully",
      vendorData: vendorObj,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

const handleVendorLogin = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Mobile and password are required",
      });
    }

    // Check if input is email or mobile number
    const isEmail = emailOrMobile.includes("@");
    const isMobile = /^[6-9]\d{9}$/.test(emailOrMobile);

    if (!isEmail && !isMobile) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email or mobile number",
      });
    }

    // Find vendor by email or mobile
    const query = isEmail
      ? { email: emailOrMobile }
      : { mobile: parseInt(emailOrMobile) };

    const vendor = await vendorModel.findOne(query);

    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: isEmail ? "Invalid email" : "Invalid mobile number",
      });
    }

    const isPassMatch = await bcrypt.compare(password, vendor.password);
    if (!isPassMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Convert to object for manipulation
    const vendorObj = vendor.toObject();

    // Remove password before sending
    delete vendorObj.password;

    const token = jwt.sign(
      { vendorId: vendor._id, role: "vendor" },
      process.env.JWT_SECRET
    );

    res.cookie("vendorToken", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    return res.status(200).json({
      success: true,
      message: "Vendor logged in successfully",
      vendorData: vendorObj,
    });
  } catch (err) {
    console.error("Vendor Login Error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const handleVendorLogout = async (req, res) => {
  try {
    res.clearCookie("vendorToken", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ success: true, message: "Vendor logged out" });
  } catch (error) {
    console.error("Vendor Logout Error:", error.message);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};

const isVendorLoggedIn = async (req, res) => {
  const token = req.cookies.vendorToken;

  if (!token) {
    return res
      .status(401)
      .json({ isLoggedIn: false, message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const vendor = await vendorModel
      .findById(decoded.vendorId)
      .select("-password");

    return res.status(200).json({ isLoggedIn: true, vendor: vendor });
  } catch (err) {
    return res
      .status(401)
      .json({ isLoggedIn: false, message: "Invalid or expired token" });
  }
};

module.exports = {
  handleVendorSignup,
  handleVendorLogin,
  handleVendorLogout,
  isVendorLoggedIn,
};
