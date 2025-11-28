const Ad = require("../models/Ad");
const path = require("path");
const fs = require("fs");

// Ensure ad directory exists
const adDir = path.resolve(__dirname, "..", "uploads", "ad");
if (!fs.existsSync(adDir)) {
  fs.mkdirSync(adDir, { recursive: true });
  console.log("✅ Created ad directory:", adDir);
}

// Get all ads (Admin only)
exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find()
      .populate('vendorId', 'businessName ownerName mobile')
      .sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      ads,
    });
  } catch (error) {
    console.error("Error fetching all ads:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ads",
      error: error.message,
    });
  }
};

// Get active ads (Public - for frontend)
exports.getActiveAds = async (req, res) => {
  try {
    const ads = await Ad.getActiveAds();

    res.status(200).json({
      success: true,
      ads,
    });
  } catch (error) {
    console.error("Error fetching active ads:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch active ads",
      error: error.message,
    });
  }
};

// Create new ad (Admin only)
exports.createAd = async (req, res) => {
  try {
    const { vendorId, title, description, link, displayOrder } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Ad image is required",
      });
    }

    // Move file from temp to ad folder
    const uniqueName = `ad-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(req.file.originalname)}`;
    const finalPath = path.join(adDir, uniqueName);

    fs.renameSync(req.file.path, finalPath);

    // Store relative path in database
    const adImgUrl = `/uploads/ad/${uniqueName}`;

    const ad = await Ad.create({
      vendorId: vendorId || null,
      adImg: adImgUrl,
      title,
      description,
      link,
      displayOrder: displayOrder || 0,
      isApproved: true, // Auto-approve admin uploads
      isVisible: true,
    });

    const populatedAd = await Ad.findById(ad._id).populate('vendorId', 'businessName ownerName mobile');

    res.status(201).json({
      success: true,
      message: "Ad created successfully",
      ad: populatedAd,
    });
  } catch (error) {
    console.error("Error creating ad:", error);
    // Clean up uploaded file if ad creation fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Failed to create ad",
      error: error.message,
    });
  }
};

// Update ad (Admin only)
exports.updateAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const { vendorId, title, description, link, displayOrder, isApproved, isVisible } = req.body;

    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    // Update image if new one is uploaded
    if (req.file) {
      // Delete old image from filesystem
      if (ad.adImg) {
        const oldImagePath = path.join(__dirname, "..", ad.adImg);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Move new file from temp to ad folder
      const uniqueName = `ad-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(req.file.originalname)}`;
      const finalPath = path.join(adDir, uniqueName);

      fs.renameSync(req.file.path, finalPath);
      ad.adImg = `/uploads/ad/${uniqueName}`;
    }

    // Update fields
    if (vendorId !== undefined) ad.vendorId = vendorId || null;
    if (title !== undefined) ad.title = title;
    if (description !== undefined) ad.description = description;
    if (link !== undefined) ad.link = link;
    if (displayOrder !== undefined) ad.displayOrder = displayOrder;
    if (isApproved !== undefined) ad.isApproved = isApproved;
    if (isVisible !== undefined) ad.isVisible = isVisible;

    await ad.save();

    const updatedAd = await Ad.findById(ad._id).populate('vendorId', 'businessName ownerName mobile');

    res.status(200).json({
      success: true,
      message: "Ad updated successfully",
      ad: updatedAd,
    });
  } catch (error) {
    console.error("Error updating ad:", error);
    // Clean up uploaded file if update fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Failed to update ad",
      error: error.message,
    });
  }
};

// Delete ad (Admin only)
exports.deleteAd = async (req, res) => {
  try {
    const { adId } = req.params;

    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    // Delete image from filesystem
    if (ad.adImg) {
      const imagePath = path.join(__dirname, "..", ad.adImg);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Ad.findByIdAndDelete(adId);

    res.status(200).json({
      success: true,
      message: "Ad deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ad:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete ad",
      error: error.message,
    });
  }
};

// Toggle ad approval (Admin only)
exports.toggleAdApproval = async (req, res) => {
  try {
    const { adId } = req.params;

    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    ad.isApproved = !ad.isApproved;
    await ad.save();

    const updatedAd = await Ad.findById(ad._id).populate('vendorId', 'businessName ownerName mobile');

    res.status(200).json({
      success: true,
      message: `Ad ${ad.isApproved ? 'approved' : 'unapproved'} successfully`,
      ad: updatedAd,
    });
  } catch (error) {
    console.error("Error toggling ad approval:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle ad approval",
      error: error.message,
    });
  }
};

// Toggle ad visibility (Admin only)
exports.toggleAdVisibility = async (req, res) => {
  try {
    const { adId } = req.params;

    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    ad.isVisible = !ad.isVisible;
    await ad.save();

    const updatedAd = await Ad.findById(ad._id).populate('vendorId', 'businessName ownerName mobile');

    res.status(200).json({
      success: true,
      message: `Ad ${ad.isVisible ? 'shown' : 'hidden'} successfully`,
      ad: updatedAd,
    });
  } catch (error) {
    console.error("Error toggling ad visibility:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle ad visibility",
      error: error.message,
    });
  }
};
