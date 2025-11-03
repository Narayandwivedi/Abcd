const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// ==========================================
// UPLOAD + PROCESS FUNCTIONS (Combined)
// ==========================================

/**
 * Upload and process passport photo for user signup
 * Handles upload and processing in one function
 */
exports.handlePassportPhotoUpload = async (file) => {
  console.log("📸 Starting passport photo upload and processing");

  if (!file) {
    throw new Error("No passport photo file provided");
  }

  console.log("File details:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
    tempPath: file.path
  });

  try {
    // Verify file exists
    if (!fs.existsSync(file.path)) {
      throw new Error(`Uploaded file not found at: ${file.path}`);
    }

    // Setup output directory
    const outputDir = path.resolve(__dirname, "..", "uploads", "passport-photos");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate output filename
    const outputFilename = `passport-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const outputPath = path.join(outputDir, outputFilename);

    console.log("Processing image...");
    console.log("Input:", file.path);
    console.log("Output:", outputPath);

    // Process image with Sharp
    await sharp(file.path)
      .resize(400, 600, {
        fit: "inside",
        withoutEnlargement: true
      })
      .webp({ quality: 85 })
      .toFile(outputPath);

    console.log("✅ Image processed successfully");

    // Delete temp file
    try {
      fs.unlinkSync(file.path);
      console.log("🗑️ Temp file deleted");
    } catch (err) {
      console.warn("⚠️ Failed to delete temp file:", err.message);
    }

    // Return relative path for database
    const relativePath = `uploads/passport-photos/${outputFilename}`;
    console.log("Saved at:", relativePath);

    return relativePath;

  } catch (error) {
    console.error("❌ Error processing passport photo:", error);

    // Cleanup temp file on error
    try {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (cleanupErr) {
      console.warn("⚠️ Failed to cleanup temp file:", cleanupErr.message);
    }

    throw new Error(`Failed to process passport photo: ${error.message}`);
  }
};

/**
 * Upload and process payment screenshot for user signup
 * Handles upload and processing in one function
 */
exports.handlePaymentScreenshotUpload = async (file) => {
  console.log("💳 Starting payment screenshot upload and processing");

  if (!file) {
    throw new Error("No payment screenshot file provided");
  }

  console.log("File details:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
    tempPath: file.path
  });

  try {
    // Verify file exists
    if (!fs.existsSync(file.path)) {
      throw new Error(`Uploaded file not found at: ${file.path}`);
    }

    // Setup output directory
    const outputDir = path.resolve(__dirname, "..", "uploads", "payment-screenshots");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate output filename
    const outputFilename = `payment-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const outputPath = path.join(outputDir, outputFilename);

    console.log("Processing image...");
    console.log("Input:", file.path);
    console.log("Output:", outputPath);

    // Process image with Sharp
    await sharp(file.path)
      .resize(1200, 1200, {
        fit: "inside",
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    console.log("✅ Image processed successfully");

    // Delete temp file
    try {
      fs.unlinkSync(file.path);
      console.log("🗑️ Temp file deleted");
    } catch (err) {
      console.warn("⚠️ Failed to delete temp file:", err.message);
    }

    // Return relative path for database
    const relativePath = `uploads/payment-screenshots/${outputFilename}`;
    console.log("Saved at:", relativePath);

    return relativePath;

  } catch (error) {
    console.error("❌ Error processing payment screenshot:", error);

    // Cleanup temp file on error
    try {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (cleanupErr) {
      console.warn("⚠️ Failed to cleanup temp file:", cleanupErr.message);
    }

    throw new Error(`Failed to process payment screenshot: ${error.message}`);
  }
};

/**
 * Upload and process vendor photo for vendor signup
 * Handles upload and processing in one function
 */
exports.handleVendorPhotoUpload = async (file) => {
  console.log("🏪 Starting vendor photo upload and processing");

  if (!file) {
    throw new Error("No vendor photo file provided");
  }

  console.log("File details:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
    tempPath: file.path
  });

  try {
    // Verify file exists
    if (!fs.existsSync(file.path)) {
      throw new Error(`Uploaded file not found at: ${file.path}`);
    }

    // Setup output directory
    const outputDir = path.resolve(__dirname, "..", "uploads", "vendor-photos");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate output filename
    const outputFilename = `vendor-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const outputPath = path.join(outputDir, outputFilename);

    console.log("Processing image...");
    console.log("Input:", file.path);
    console.log("Output:", outputPath);

    // Process image with Sharp
    await sharp(file.path)
      .resize(400, 600, {
        fit: "inside",
        withoutEnlargement: true
      })
      .webp({ quality: 85 })
      .toFile(outputPath);

    console.log("✅ Image processed successfully");

    // Delete temp file
    try {
      fs.unlinkSync(file.path);
      console.log("🗑️ Temp file deleted");
    } catch (err) {
      console.warn("⚠️ Failed to delete temp file:", err.message);
    }

    // Return relative path for database
    const relativePath = `uploads/vendor-photos/${outputFilename}`;
    console.log("Saved at:", relativePath);

    return relativePath;

  } catch (error) {
    console.error("❌ Error processing vendor photo:", error);

    // Cleanup temp file on error
    try {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (cleanupErr) {
      console.warn("⚠️ Failed to cleanup temp file:", cleanupErr.message);
    }

    throw new Error(`Failed to process vendor photo: ${error.message}`);
  }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Clean up temp files older than 1 hour
 */
exports.cleanupTempFiles = () => {
  try {
    const tempDir = path.resolve(__dirname, "..", "uploads", "temp");

    if (!fs.existsSync(tempDir)) return;

    const files = fs.readdirSync(tempDir);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    let cleaned = 0;

    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      const stats = fs.statSync(filePath);

      if (now - stats.mtimeMs > oneHour) {
        fs.unlinkSync(filePath);
        cleaned++;
      }
    });

    if (cleaned > 0) {
      console.log(`🗑️ Cleaned up ${cleaned} old temp files`);
    }
  } catch (error) {
    console.error("❌ Error cleaning temp files:", error.message);
  }
};
