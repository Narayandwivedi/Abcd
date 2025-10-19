const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");

// Upload payment screenshot
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

    // Define output path for WebP image
    const outputDir = path.join(__dirname, "..", "uploads", "payment-screenshots");
    const webpFilename = `payment-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const webpPath = path.join(outputDir, webpFilename);

    // Process image: resize and convert to WebP
    await sharp(req.file.path)
      .resize(1200, 1200, {
        fit: "inside", // Maintain aspect ratio, don't exceed 1200x1200
        withoutEnlargement: true, // Don't enlarge if image is smaller
      })
      .webp({
        quality: 80, // Good balance between quality and file size
      })
      .toFile(webpPath);

    // Delete original uploaded file
    fs.unlinkSync(req.file.path);

    // Store relative path in database
    const relativePath = `uploads/payment-screenshots/${webpFilename}`;

    // Update user with payment screenshot path
    const user = await User.findByIdAndUpdate(
      userId,
      { paymentScreenshot: relativePath },
      { new: true }
    );

    if (!user) {
      // Delete WebP file if user not found
      fs.unlinkSync(webpPath);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment screenshot uploaded successfully",
      data: {
        filename: webpFilename,
        path: relativePath,
        size: fs.statSync(webpPath).size,
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
