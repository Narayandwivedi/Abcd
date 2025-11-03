const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const vendorModel = require("../models/Vendor.js");
const { handleVendorPhotoUpload } = require("./uploadController");
const { sendVendorSignupAlert } = require("../utils/telegramAlert");

const handleVendorSignup = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "missing data" });
    }

    let { email, mobile, ownerName, businessName, city, membershipCategory, category, subCategory } = req.body;

    // Trim input fields
    email = email?.trim();
    ownerName = ownerName?.trim();
    businessName = businessName?.trim();
    city = city?.trim();
    membershipCategory = membershipCategory?.trim();
    category = category?.trim();
    subCategory = subCategory?.trim();

    if (!mobile || !ownerName || !businessName || !city || !category || !subCategory || !membershipCategory) {
      return res.status(400).json({ success: false, message: "Mobile, owner name, business name, city, category, sub-category, and membership category are required" });
    }

    // Validate Indian mobile number
    if (mobile < 6000000000 || mobile > 9999999999) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Indian mobile number",
      });
    }

    // Check if vendor already exists by email or mobile
    const existingVendorQuery = [{ mobile }];
    if (email) {
      existingVendorQuery.push({ email });
    }

    const existingVendor = await vendorModel.findOne({
      $or: existingVendorQuery
    });

    if (existingVendor) {
      if (email && existingVendor.email === email) {
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
    }

    const newVendorData = {
      mobile,
      ownerName,
      businessName,
      city, // Required field
      category,
      subCategory,
      membershipCategory, // Required field
      isBusinessApplicationSubmitted: true, // Skip business form, go directly to pending approval
    };

    // Add optional email field
    if (email) {
      newVendorData.email = email;
    }

    // Process vendor photo if provided
    if (req.files && req.files.vendorPhoto && req.files.vendorPhoto[0]) {
      try {
        newVendorData.passportPhoto = await handleVendorPhotoUpload(req.files.vendorPhoto[0]);
      } catch (error) {
        console.error("Vendor photo upload error:", error);
        return res.status(500).json({
          success: false,
          message: error.message || "Failed to upload vendor photo"
        });
      }
    }

    // Create new vendor WITHOUT logging them in (similar to user signup)
    const newVendor = await vendorModel.create(newVendorData);

    // Remove password before sending response
    const vendorObj = newVendor.toObject();
    delete vendorObj.password;

    // Send Telegram vendor signup alert
    try {
      await sendVendorSignupAlert(vendorObj);
    } catch (err) {
      console.error("Telegram Vendor Alert Error:", err.message);
    }

    // DO NOT generate JWT token or set cookies - admin will verify first
    return res.status(201).json({
      success: true,
      message: "Registration submitted successfully. We will review your profile and contact you soon.",
      vendorData: vendorObj,
    });
  } catch (err) {
    console.error("❌ Vendor Signup Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const handleVendorLogin = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
      console.log('❌ Missing credentials');
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
      console.log('❌ Vendor not found:', query);
      return res.status(401).json({
        success: false,
        message: isEmail ? "Invalid email" : "Invalid mobile number",
      });
    }

    console.log('✓ Vendor found:', vendor.businessName || vendor.email);

    const isPassMatch = await bcrypt.compare(password, vendor.password);
    if (!isPassMatch) {
      console.log('❌ Password mismatch');
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    console.log('✓ Password matched');

    // Convert to object for manipulation
    const vendorObj = vendor.toObject();

    // Remove password before sending
    delete vendorObj.password;

    const token = jwt.sign(
      { vendorId: vendor._id, role: "vendor" },
      process.env.JWT_SECRET
    );

    // Cookie settings for cross-origin requests
    const isHttpsBackend = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https';

    console.log('🍪 Setting cookie:', {
      protocol: req.protocol,
      isHttpsBackend,
      sameSite: isHttpsBackend ? "None" : "Lax",
      secure: isHttpsBackend
    });

    res.cookie("vendorToken", token, {
      httpOnly: true,
      sameSite: isHttpsBackend ? "None" : "Lax",
      secure: isHttpsBackend,
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    console.log('✅ Login successful for:', vendorObj.businessName || vendorObj.email);

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
    // Match cookie settings from login/signup for proper clearing
    const isHttpsBackend = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https';

    res.clearCookie("vendorToken", {
      httpOnly: true,
      sameSite: isHttpsBackend ? "None" : "Lax",
      secure: isHttpsBackend,
    });
    return res.status(200).json({ success: true, message: "Vendor logged out" });
  } catch (error) {
    console.error("Vendor Logout Error:", error.message);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};

const isVendorLoggedIn = async (req, res) => {
  console.log('🔍 Auth status check - cookies:', Object.keys(req.cookies));
  const token = req.cookies.vendorToken;

  if (!token) {
    console.log('❌ No vendorToken cookie found');
    return res
      .status(401)
      .json({ isLoggedIn: false, message: "No token found" });
  }

  console.log('✓ Token found, verifying...');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const vendor = await vendorModel
      .findById(decoded.vendorId)
      .select("-password");

    console.log('✅ Token valid, vendor:', vendor?.businessName || vendor?.email);
    return res.status(200).json({ isLoggedIn: true, vendor: vendor });
  } catch (err) {
    console.log('❌ Token verification failed:', err.message);
    return res
      .status(401)
      .json({ isLoggedIn: false, message: "Invalid or expired token" });
  }
};

// Google OAuth Handler for Vendors
const handleVendorGoogleAuth = async (req, res) => {
  const { OAuth2Client } = require('google-auth-library');
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required"
      });
    }

    console.log('🔐 Verifying Google token for vendor...');

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      sub: googleId,
      email,
      name,
      picture: profilePicture,
      email_verified
    } = payload;

    if (!email_verified) {
      return res.status(400).json({
        success: false,
        message: "Google email not verified"
      });
    }

    console.log('✓ Google token verified for:', email);

    // Check if vendor exists
    let vendor = await vendorModel.findOne({
      $or: [
        { email: email },
        { googleId: googleId }
      ]
    });

    if (vendor) {
      // Vendor exists, update Google info if needed
      console.log('✓ Existing vendor found:', vendor.businessName || vendor.email);
      if (!vendor.googleId) {
        vendor.googleId = googleId;
        vendor.profilePicture = profilePicture;
        vendor.authProvider = 'google';
        await vendor.save();
      }
    } else {
      // Create new vendor with Google info
      console.log('📝 Creating new vendor from Google data');
      const newVendorData = {
        ownerName: name,
        businessName: name + "'s Business", // Default business name
        email,
        googleId,
        profilePicture,
        authProvider: 'google',
        isEmailVerified: true,
        // Don't set mobile, gstNumber, businessCategory - leave as undefined
        // This allows sparse indexes to work properly
      };

      vendor = await vendorModel.create(newVendorData);
      console.log('✅ New vendor created:', vendor.email);
    }

    // Generate JWT token
    const token = jwt.sign(
      { vendorId: vendor._id, role: "vendor" },
      process.env.JWT_SECRET
    );

    // Cookie settings for cross-origin requests
    const isHttpsBackend = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https';

    console.log('🍪 Setting vendorToken cookie:', {
      protocol: req.protocol,
      forwardedProto: req.get('x-forwarded-proto'),
      isHttpsBackend,
      sameSite: isHttpsBackend ? "None" : "Lax",
      secure: isHttpsBackend
    });

    res.cookie('vendorToken', token, {
      httpOnly: true,
      sameSite: isHttpsBackend ? "None" : "Lax",
      secure: isHttpsBackend,
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    // Prepare vendor data for response
    const vendorObj = vendor.toObject();
    delete vendorObj.password;

    console.log('✅ Google authentication successful for vendor');

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      vendorData: vendorObj
    });

  } catch (error) {
    console.error('❌ Vendor Google authentication error:', error);
    return res.status(400).json({
      success: false,
      message: 'Google authentication failed',
      error: error.message
    });
  }
};

module.exports = {
  handleVendorSignup,
  handleVendorLogin,
  handleVendorLogout,
  isVendorLoggedIn,
  handleVendorGoogleAuth,
};
