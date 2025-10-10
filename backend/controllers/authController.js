const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/User.js");
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const handelUserSignup = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "missing data" });
    }

    let { fullName, email, password, mobile } = req.body;

    // Trim input fields
    fullName = fullName?.trim();
    email = email?.trim();
    password = password?.trim();

    if (!fullName || !email || !password || !mobile) {
      return res.status(400).json({ success: false, message: "missing field" });
    }

    // Validate Indian mobile number
    if (mobile < 6000000000 || mobile > 9999999999) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Indian mobile number",
      });
    }

    // Check if user already exists by email or mobile
    const existingUser = await userModel.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
      if (existingUser.mobile === mobile) {
        return res.status(400).json({
          success: false,
          message: "Mobile number already exists",
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);

    const newUserData = {
      fullName,
      email,
      password: hashedPassword,
      mobile,
    };

    // Create new user
    const newUser = await userModel.create(newUserData);

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    // Remove password before sending response
    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(201).json({
      success: true,
      message: "user created successfully",
      userData: userObj,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    console.error("Error Stack:", err.stack);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const handelUserLogin = async (req, res) => {
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

    // Find user by email or mobile
    const query = isEmail
      ? { email: emailOrMobile }
      : { mobile: parseInt(emailOrMobile) };

    const user = await userModel.findOne(query);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: isEmail ? "Invalid email" : "Invalid mobile number",
      });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Convert to object for manipulation
    const userObj = user.toObject();

    // Remove password before sending
    delete userObj.password;

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    return res.status(200).json({
      success: true,
      message: "user logged in successfully",
      userData: userObj,
    });
  } catch (err) {
    console.error("Login Error:", err);
    console.error("Error Stack:", err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const handleUserLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    console.error("Logout Error:", error);
    console.error("Error Stack:", error.stack);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};

const isloggedin = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ isLoggedIn: false, message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel
      .findById(decoded.userId)
      .select("-password");

    return res.status(200).json({ isLoggedIn: true, user: user });
  } catch (err) {
    console.error("Auth Status Error:", err);
    console.error("Error Stack:", err.stack);
    return res
      .status(401)
      .json({ isLoggedIn: false, message: "Invalid or expired token" });
  }
};

const generateResetPassOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email address" });
    }

    const getUser = await userModel.findOne({ email });

    if (!getUser) {
      return res.status(400).json({
        success: false,
        message: `User with this email doesn't exist`,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    getUser.resetOtp = otp;
    getUser.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
    await getUser.save();

    // For development, log the OTP to console
    console.log(`Reset OTP for ${email}: ${otp}`);

    // TODO: Send email with OTP using nodemailer
    // const transporter = require("../utils/nodemailer.js");
    // const mailOptions = {
    //   from: "your-email@gmail.com",
    //   to: email,
    //   subject: "Account Password Reset OTP",
    //   text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
    // };
    // await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Generate OTP Error:", err);
    console.error("Error Stack:", err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const submitResetPassOTP = async (req, res) => {
  try {
    const { otp, newPass, email } = req.body;

    if (!otp || !newPass || !email) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const getUser = await userModel.findOne({ email });
    if (!getUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found, try again" });
    }

    // Check if OTP exists
    if (!getUser.resetOtp) {
      return res
        .status(400)
        .json({ success: false, message: "No OTP found for this user" });
    }

    // Check if OTP is expired
    if (getUser.otpExpiresAt < Date.now()) {
      // Clear expired OTP
      getUser.resetOtp = undefined;
      getUser.otpExpiresAt = undefined;
      await getUser.save();
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Convert both OTP values to numbers for comparison
    if (Number(otp) === Number(getUser.resetOtp)) {
      const newHashedPass = await bcrypt.hash(newPass, 10);
      getUser.password = newHashedPass;

      // Clear OTP fields after successful password reset
      getUser.resetOtp = undefined;
      getUser.otpExpiresAt = undefined;

      await getUser.save();

      return res.json({
        success: true,
        message: "Password reset successfully",
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (err) {
    console.error("Submit OTP Error:", err);
    console.error("Error Stack:", err.stack);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Google OAuth Handler
const handleGoogleAuth = async (req, res) => {
  try {
    const { credential, userType } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required"
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      sub: googleId,
      email,
      name: fullName,
      picture: profilePicture,
      email_verified
    } = payload;

    if (!email_verified) {
      return res.status(400).json({
        success: false,
        message: "Google email not verified"
      });
    }

    // Determine role based on userType parameter
    const userRole = userType === 'vendor' ? 'vendor' : 'user';

    // Check if user exists
    let user = await userModel.findOne({
      $or: [
        { email: email },
        { googleId: googleId }
      ]
    });

    if (user) {
      // User exists, update Google info if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePicture = profilePicture;
        user.authProvider = 'google';
        user.isEmailVerified = true;
        await user.save();
      }
    } else {
      // Create new user with specified role
      const newUserData = {
        fullName,
        email,
        googleId,
        profilePicture,
        isEmailVerified: email_verified,
        authProvider: 'google',
        role: userRole, // Set role based on userType parameter
      };

      user = await userModel.create(newUserData);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    // Prepare user data for response
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      userData: userObj
    });

  } catch (error) {
    console.error('Google authentication error:', error);
    return res.status(400).json({
      success: false,
      message: 'Google authentication failed',
      error: error.message
    });
  }
};

module.exports = {
  handelUserSignup,
  handelUserLogin,
  handleUserLogout,
  generateResetPassOTP,
  submitResetPassOTP,
  isloggedin,
  handleGoogleAuth,
};
