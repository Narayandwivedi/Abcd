const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const AgraMahakumbh2026 = require("../models/AgraMahakumbh2026");

// Helper function to process uploaded images (optimized via Sharp)
const processUploadedFile = async (file, subFolder) => {
  if (!file) return null;

  const outputDir = path.resolve(__dirname, "..", "uploads", "agra-mahakumbh-2026", subFolder);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const ext = path.extname(file.originalname).toLowerCase();
  const uniqueId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

  if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    const outputFilename = `${subFolder}-${uniqueId}.webp`;
    const outputPath = path.join(outputDir, outputFilename);
    try {
      await sharp(file.path)
        .resize(1200, 1200, {
          fit: "inside",
          withoutEnlargement: true
        })
        .webp({ quality: 85 })
        .toFile(outputPath);

      // Clean up temp file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return `uploads/agra-mahakumbh-2026/${subFolder}/${outputFilename}`;
    } catch (sharpError) {
      console.error(`Sharp processing failed for ${file.originalname}, copying original:`, sharpError);
    }
  }

  // Fallback copy if sharp fails
  const outputFilename = `${subFolder}-${uniqueId}${ext}`;
  const outputPath = path.join(outputDir, outputFilename);
  fs.copyFileSync(file.path, outputPath);

  if (fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }
  return `uploads/agra-mahakumbh-2026/${subFolder}/${outputFilename}`;
};

// Handle registration submission
exports.submitRegistration = async (req, res) => {
  try {
    console.log("=== Agra Mahakumbh 2026 Registration Submitted ===");

    if (!req.body) {
      return res.status(400).json({ success: false, message: "डेटा गायब है" });
    }

    const {
      fullName,
      gender,
      mobileNo,
      dob,
      age,
      fatherName,
      address,
      registrationType,
      registrationFee,
      utrNumber,
      travelMode,
      travelDetail,
      arrivalDate,
      arrivalTime
    } = req.body;

    // Validate required fields
    if (!fullName || !gender || !mobileNo || !fatherName || !address || !registrationType || !registrationFee) {
      return res.status(400).json({
        success: false,
        message: "नाम, लिंग, मोबाइल नंबर, पंजीकरण प्रकार और शुल्क भरना अनिवार्य है"
      });
    }

    // Generate sequential registration number (Agra-2026-001, Agra-2026-002, ...)
    const eventYear = new Date().getFullYear();
    const existingRegs = await AgraMahakumbh2026.find({
      registrationNo: { $regex: new RegExp(`^Agra-${eventYear}-`) }
    }).select("registrationNo").lean();

    let maxSeq = 0;
    existingRegs.forEach((reg) => {
      const match = reg.registrationNo.match(/^Agra-(\d{4})-(\d+)$/);
      if (match && parseInt(match[1], 10) === eventYear) {
        const seq = parseInt(match[2], 10);
        if (seq > maxSeq) maxSeq = seq;
      }
    });

    const registrationNo = `Agra-${eventYear}-${String(maxSeq + 1).padStart(3, "0")}`;

    let photoPath = "";
    let paymentPath = "";

    // Process passport photo
    if (req.files && req.files.photo && req.files.photo[0]) {
      try {
        photoPath = await processUploadedFile(req.files.photo[0], "photos");
      } catch (err) {
        console.error("Error uploading photo:", err);
        return res.status(500).json({ success: false, message: "फ़ोटो अपलोड करने में विफलता" });
      }
    }

    // Process payment screenshot
    if (req.files && req.files.paymentScreenshot && req.files.paymentScreenshot[0]) {
      try {
        paymentPath = await processUploadedFile(req.files.paymentScreenshot[0], "payments");
      } catch (err) {
        console.error("Error uploading payment screenshot:", err);
        return res.status(500).json({ success: false, message: "भुगतान स्क्रीनशॉट अपलोड करने में विफलता" });
      }
    }

    const newRegistration = new AgraMahakumbh2026({
      registrationNo,
      fullName,
      gender,
      mobileNo,
      dob: dob || "",
      age: age || "",
      fatherName: fatherName || "",
      address: address || "",
      registrationType,
      registrationFee,
      photo: photoPath,
      paymentScreenshot: paymentPath,
      utrNumber: utrNumber || "",
      travelMode: travelMode || "",
      travelDetail: travelDetail || "",
      arrivalDate: arrivalDate || "",
      arrivalTime: arrivalTime || "",
      status: "pending"
    });

    await newRegistration.save();

    console.log(`✅ Agra Mahakumbh 2026 registration submitted successfully. ID: ${registrationNo}`);

    return res.status(201).json({
      success: true,
      message: "पंजीकरण सफलतापूर्वक जमा कर दिया गया है",
      registrationNo,
      data: newRegistration
    });

  } catch (error) {
    console.error("❌ Agra Mahakumbh 2026 submission error:", error);
    return res.status(500).json({
      success: false,
      message: "सर्वर त्रुटि: पंजीकरण जमा करने में विफलता"
    });
  }
};