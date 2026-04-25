const VendorApplication = require('../models/VendorApplication');
const { sendVendorSignupAlert } = require("../utils/telegramAlert");
const path = require('path');
const fs = require('fs');

const submitApplication = async (req, res) => {
  try {
    const { ownerName, whatsappNumber, businessName, city, referralCode, membershipType, membershipAmount, utrNumber } = req.body;

    if (!ownerName || !whatsappNumber || !businessName || !city) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    // Either screenshot or UTR is required
    const hasUtr = utrNumber && utrNumber.trim().length > 0;
    const hasScreenshot = !!(req.file);
    if (!hasUtr && !hasScreenshot) {
      return res.status(400).json({ success: false, message: "Please upload a payment screenshot or enter a UTR number" });
    }

    const newApplication = new VendorApplication({
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
      message: "Application submitted successfully! Our team will contact you soon."
    });
  } catch (error) {
    console.error("Vendor Application Error:", error);
    return res.status(500).json({ success: false, message: "Failed to submit application. Please try again." });
  }
};

module.exports = { submitApplication };
