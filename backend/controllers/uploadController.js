const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");

/**
 * Process and upload passport photo
 * Used during user signup
 */
exports.processPassportPhoto = async (file) => {
  try {
    if (!file) {
      throw new Error("No passport photo file provided");
    }

    const uploadDir = path.join(__dirname, "..", "uploads", "passport-photos");

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const webpFilename = `passport-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const webpPath = path.join(uploadDir, webpFilename);

    // Process image: resize and convert to WebP
    await sharp(file.path)
      .resize(400, 600, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 85,
      })
      .toFile(webpPath);

    // Delete original uploaded file
    fs.unlinkSync(file.path);

    // Return relative path for database storage
    return `upload/passport-photos/${webpFilename}`;
  } catch (error) {
    // Clean up files on error
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw new Error(`Failed to process passport photo: ${error.message}`);
  }
};

/**
 * Process and upload vendor photo
 * Used during vendor signup
 */
exports.processVendorPhoto = async (file) => {
  try {
    if (!file) {
      throw new Error("No vendor photo file provided");
    }

    const uploadDir = path.join(__dirname, "..", "uploads", "vendor-photos");

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const webpFilename = `vendor-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const webpPath = path.join(uploadDir, webpFilename);

    // Process image: resize and convert to WebP
    await sharp(file.path)
      .resize(400, 600, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 85,
      })
      .toFile(webpPath);

    // Delete original uploaded file
    fs.unlinkSync(file.path);

    // Return relative path for database storage
    return `upload/vendor-photos/${webpFilename}`;
  } catch (error) {
    // Clean up files on error
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw new Error(`Failed to process vendor photo: ${error.message}`);
  }
};

/**
 * Process and upload payment screenshot
 * Used during user signup
 */
exports.processPaymentScreenshot = async (file) => {
  try {
    if (!file) {
      throw new Error("No payment screenshot file provided");
    }

    const uploadDir = path.join(__dirname, "..", "uploads", "payment-screenshots");

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const webpFilename = `payment-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const webpPath = path.join(uploadDir, webpFilename);

    // Process image: resize and convert to WebP
    await sharp(file.path)
      .resize(1200, 1200, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 80,
      })
      .toFile(webpPath);

    // Delete original uploaded file
    fs.unlinkSync(file.path);

    // Return relative path for database storage
    return `upload/payment-screenshots/${webpFilename}`;
  } catch (error) {
    // Clean up files on error
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw new Error(`Failed to process payment screenshot: ${error.message}`);
  }
};

/**
 * Upload payment screenshot (API endpoint for authenticated users)
 */
exports.uploadPaymentScreenshot = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const userId = req.user?.id; // Assuming you have auth middleware that adds user to req

    if (!userId) {
      // Delete uploaded file if user is not authenticated
      fs.unlinkSync(req.file.path);
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Process the payment screenshot
    const relativePath = await this.processPaymentScreenshot(req.file);

    // Update user with payment screenshot path
    const user = await User.findByIdAndUpdate(
      userId,
      { paymentScreenshot: relativePath },
      { new: true }
    );

    if (!user) {
      // Delete uploaded file if user not found
      const fullPath = path.join(__dirname, "..", relativePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const fullPath = path.join(__dirname, "..", relativePath);
    res.status(200).json({
      success: true,
      message: "Payment screenshot uploaded successfully",
      data: {
        path: relativePath,
        size: fs.statSync(fullPath).size,
      },
    });
  } catch (error) {
    // Clean up file if it exists and there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("Error uploading payment screenshot:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload payment screenshot",
      error: error.message,
    });
  }
};
