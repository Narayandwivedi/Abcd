const UserApplication = require('../models/UserApplication');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const { sendUserApplicationAlert } = require("../utils/telegramAlert");
const { generateUserApplicationNumber } = require('../utils/generateApplicationNumber');

const submitApplication = async (req, res) => {
  try {
    const { fullName, whatsappNumber, city, referralCode, utrNumber } = req.body;

    if (!fullName || !whatsappNumber || !city) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    // Either screenshot or UTR is required
    const hasUtr = utrNumber && utrNumber.trim().length > 0;
    const hasScreenshot = !!(req.file);
    if (!hasUtr && !hasScreenshot) {
      return res.status(400).json({ success: false, message: "Please upload a payment screenshot or enter a UTR number" });
    }

    const applicationNumber = await generateUserApplicationNumber();

    const newApplication = new UserApplication({
      applicationNumber,
      fullName,
      whatsappNumber,
      city,
      referralCode: referralCode || '',
      utrNumber: utrNumber || '',
      paymentScreenshot: req.file ? `uploads/temp/${req.file.filename}` : undefined,
    });

    await newApplication.save();

    // Send Telegram alert
    try {
      await sendUserApplicationAlert({
        applicationNumber,
        fullName,
        mobile: whatsappNumber,
        city,
        referredBy: referralCode,
        utrNumber: utrNumber || 'N/A',
      });
    } catch (err) {
      console.error("Telegram User Alert Error:", err.message);
    }

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully! Our team will contact you soon."
    });
  } catch (error) {
    console.error("User Application Error:", error);
    return res.status(500).json({ success: false, message: "Failed to submit application. Please try again." });
  }
};

const verifyReferralCode = async (req, res) => {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({ success: false, message: "Code is required" });
    }

    let person = null;
    let name = "";
    let city = "";

    if (code.startsWith('VCG')) {
      person = await Vendor.findOne({ referralCode: code });
      if (person) {
        name = person.ownerName;
        city = person.city;
      }
    } else if (code.startsWith('CG')) {
      person = await User.findOne({ referralCode: code });
      if (person) {
        name = person.fullName;
        city = person.city;
      }
    }

    if (!person) {
      return res.status(404).json({ success: false, message: "Invalid referral code" });
    }

    return res.status(200).json({
      success: true,
      data: { name, city }
    });
  } catch (error) {
    console.error("Referral Verify Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await UserApplication.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error("Fetch User Applications Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch applications" });
  }
};

module.exports = { submitApplication, verifyReferralCode, getAllApplications };
