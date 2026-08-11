const VendorApplication = require('../models/VendorApplication');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const { sendVendorSignupAlert } = require("../utils/telegramAlert");
const path = require('path');
const fs = require('fs');
const { generateVendorApplicationNumber } = require('../utils/generateApplicationNumber');

const submitApplication = async (req, res) => {
  try {
    const { ownerName, whatsappNumber, businessName, city, referralCode, membershipType, membershipAmount, utrNumber } = req.body;

    if (!ownerName || !whatsappNumber || !businessName || !city) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }



    const applicationNumber = await generateVendorApplicationNumber();

    const newApplication = new VendorApplication({
      applicationNumber,
      ownerName,
      whatsappNumber,
      businessName,
      city,
      referralCode: referralCode || '',
      membershipType: membershipType || undefined,
      membershipAmount: membershipAmount ? Number(membershipAmount) : undefined,
      utrNumber: utrNumber || '',
      paymentScreenshot: req.file ? `uploads/temp/${req.file.filename}` : undefined,
    });

    await newApplication.save();

    // Send Telegram alert
    try {
      await sendVendorSignupAlert({
        applicationNumber,
        ownerName: ownerName + ' (Application)',
        mobile: whatsappNumber,
        businessName,
        city,
        referralId: referralCode,
        membershipType,
        membershipFees: membershipAmount,
        utrNumber: utrNumber || 'N/A',
      });
    } catch (err) {
      console.error("Telegram Vendor Alert Error:", err.message);
    }

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully! Our team will contact you soon.",
      applicationNumber
    });
  } catch (error) {
    console.error("Vendor Application Error:", error);
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
    const applications = await VendorApplication.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("Get All Applications Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const application = await VendorApplication.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    application.status = 'rejected';
    // Optionally store the reason if we add a field for it, but for now just mark as rejected
    await application.save();

    console.log(`[ADMIN] Vendor Application rejected: ${application.businessName}`);

    return res.status(200).json({
      success: true,
      message: "Application rejected successfully",
      application: {
        _id: application._id,
        businessName: application.businessName,
        status: application.status
      }
    });
  } catch (error) {
    console.error("Reject Application Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { submitApplication, verifyReferralCode, getAllApplications, rejectApplication };
