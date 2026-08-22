const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const AgraAlankaran = require("../models/AgraAlankaran");

// Helper function to process uploaded files (images optimized via Sharp, PDFs/other copied directly)
const processUploadedFile = async (file, subFolder) => {
  if (!file) return null;

  const outputDir = path.resolve(__dirname, "..", "uploads", "agra-alankaran", subFolder);
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
      return `uploads/agra-alankaran/${subFolder}/${outputFilename}`;
    } catch (sharpError) {
      console.error(`Sharp processing failed for ${file.originalname}, copying original:`, sharpError);
    }
  }

  // Fallback copy for PDFs or if sharp fails
  const outputFilename = `${subFolder}-${uniqueId}${ext}`;
  const outputPath = path.join(outputDir, outputFilename);
  fs.copyFileSync(file.path, outputPath);
  
  if (fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }
  return `uploads/agra-alankaran/${subFolder}/${outputFilename}`;
};

// Handle submission
exports.submitApplication = async (req, res) => {
  try {
    console.log("=== Agra Alankaran Application Submission Started ===");
    
    if (!req.body) {
      return res.status(400).json({ success: false, message: "डेटा गायब है" });
    }

    const {
      awardCategory,
      applicantName,
      dob,
      age,
      fatherHusbandName,
      fullAddress,
      mobileNo,
      email,
      achievementDesc,
      date,
      place
    } = req.body;

    // Validate required fields (email and age are optional)
    if (!awardCategory || !applicantName || !dob || !fatherHusbandName || !fullAddress || !mobileNo || !achievementDesc) {
      return res.status(400).json({
        success: false,
        message: "सभी आवश्यक फ़ील्ड भरना अनिवार्य है"
      });
    }

    // Generate sequential application number (AGR-2026-001, AGR-2026-002, ...)
    const eventYear = new Date().getFullYear();
    const existingApps = await AgraAlankaran.find({
      applicationNo: { $regex: new RegExp(`^AGR-${eventYear}-`) }
    }).select("applicationNo").lean();

    let maxSeq = 0;
    existingApps.forEach((app) => {
      const match = app.applicationNo.match(/^AGR-(\d{4})-(\d+)$/);
      if (match && parseInt(match[1], 10) === eventYear) {
        const seq = parseInt(match[2], 10);
        if (seq > maxSeq) maxSeq = seq;
      }
    });

    const applicationNo = `AGR-${eventYear}-${String(maxSeq + 1).padStart(3, "0")}`;

    let photoPath = "";
    let docPaths = [];

    // Process photo
    if (req.files && req.files.photo && req.files.photo[0]) {
      try {
        photoPath = await processUploadedFile(req.files.photo[0], "photos");
      } catch (err) {
        console.error("Error uploading photo:", err);
        return res.status(500).json({ success: false, message: "फ़ोटो अपलोड करने में विफलता" });
      }
    }

    // Process certificates/documents (multiple allowed)
    if (req.files && req.files.documents && req.files.documents.length > 0) {
      try {
        for (const file of req.files.documents) {
          const path = await processUploadedFile(file, "documents");
          if (path) {
            docPaths.push(path);
          }
        }
      } catch (err) {
        console.error("Error uploading document:", err);
        return res.status(500).json({ success: false, message: "प्रमाण पत्र अपलोड करने में विफलता" });
      }
    }

    const newApplication = new AgraAlankaran({
      applicationNo,
      awardCategory,
      applicantName,
      dob,
      age,
      fatherHusbandName,
      fullAddress,
      mobileNo,
      email,
      achievementDesc,
      photo: photoPath,
      document: docPaths.length > 0 ? docPaths[0] : "",
      documents: docPaths,
      date: date || new Date().toISOString().split('T')[0],
      place: place || "रायपुर",
      status: "pending"
    });

    await newApplication.save();

    console.log(`✅ Agra Alankaran Application submitted successfully. ID: ${applicationNo}`);

    return res.status(201).json({
      success: true,
      message: "आवेदन सफलतापूर्वक जमा कर दिया गया है",
      applicationNo,
      data: newApplication
    });

  } catch (error) {
    console.error("❌ Agra Alankaran submission error:", error);
    return res.status(500).json({
      success: false,
      message: "सर्वर त्रुटि: आवेदन जमा करने में विफलता"
    });
  }
};
