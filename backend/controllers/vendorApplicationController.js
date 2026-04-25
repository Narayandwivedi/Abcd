const VendorApplication = require('../models/VendorApplication');
const { sendVendorSignupAlert } = require("../utils/telegramAlert");

const submitApplication = async (req, res) => {
  try {
    const { ownerName, whatsappNumber, businessName, city, referralCode, paymentInformation } = req.body;

    if (!ownerName || !whatsappNumber || !businessName || !city) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    const newApplication = new VendorApplication({
      ownerName,
      whatsappNumber,
      businessName,
      city,
      referralCode,
      paymentInformation
    });

    await newApplication.save();

    // Send telegram alert using the existing alert structure
    try {
      await sendVendorSignupAlert({
        ownerName: ownerName + ' (Lead)',
        mobile: whatsappNumber,
        businessName,
        city,
        referralId: referralCode,
        paymentDetails: paymentInformation
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

module.exports = {
  submitApplication
};
