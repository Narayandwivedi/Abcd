const Offer = require("../models/Offer");
const path = require("path");
const fs = require("fs");

// Ensure offer directory exists
const offerDir = path.resolve(__dirname, "..", "uploads", "offer");
if (!fs.existsSync(offerDir)) {
  fs.mkdirSync(offerDir, { recursive: true });
  console.log("✅ Created offer directory:", offerDir);
}

// Get all offers (Admin only)
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find()
      .populate('vendorId', 'businessName ownerName mobile')
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      offers,
    });
  } catch (error) {
    console.error("Error fetching all offers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch offers",
      error: error.message,
    });
  }
};

// Create new offer (Admin only)
exports.createOffer = async (req, res) => {
  try {
    const { vendorId, categoryId, title, description, discountPercentage, displayOrder, expiryDate } = req.body;

    let offerImgUrl = '';

    if (req.file) {
      // Move file from temp to offer folder
      const uniqueName = `offer-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(req.file.originalname)}`;
      const finalPath = path.join(offerDir, uniqueName);

      fs.renameSync(req.file.path, finalPath);

      // Store relative path in database
      offerImgUrl = `/uploads/offer/${uniqueName}`;
    }

    const offer = await Offer.create({
      vendorId,
      categoryId,
      title,
      description,
      discountPercentage,
      offerImage: offerImgUrl || null,
      displayOrder: displayOrder || 0,
      expiryDate: expiryDate || null,
      isActive: true,
    });

    const populatedOffer = await Offer.findById(offer._id)
      .populate('vendorId', 'businessName ownerName mobile')
      .populate('categoryId', 'name slug');

    res.status(201).json({
      success: true,
      message: "Offer created successfully",
      offer: populatedOffer,
    });
  } catch (error) {
    console.error("Error creating offer:", error);
    // Clean up uploaded file if offer creation fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Failed to create offer",
      error: error.message,
    });
  }
};

// Update offer (Admin only)
exports.updateOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { vendorId, categoryId, title, description, discountPercentage, displayOrder, expiryDate, isActive } = req.body;

    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // Update image if new one is uploaded
    if (req.file) {
      // Delete old image from filesystem
      if (offer.offerImage) {
        const oldImagePath = path.join(__dirname, "..", offer.offerImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Move new file from temp to offer folder
      const uniqueName = `offer-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(req.file.originalname)}`;
      const finalPath = path.join(offerDir, uniqueName);

      fs.renameSync(req.file.path, finalPath);
      offer.offerImage = `/uploads/offer/${uniqueName}`;
    }

    // Update fields
    if (vendorId !== undefined) offer.vendorId = vendorId;
    if (categoryId !== undefined) offer.categoryId = categoryId;
    if (title !== undefined) offer.title = title;
    if (description !== undefined) offer.description = description;
    if (discountPercentage !== undefined) offer.discountPercentage = discountPercentage;
    if (displayOrder !== undefined) offer.displayOrder = displayOrder;
    if (expiryDate !== undefined) offer.expiryDate = expiryDate || null;
    if (isActive !== undefined) offer.isActive = isActive;

    await offer.save();

    const updatedOffer = await Offer.findById(offer._id)
      .populate('vendorId', 'businessName ownerName mobile')
      .populate('categoryId', 'name slug');

    res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      offer: updatedOffer,
    });
  } catch (error) {
    console.error("Error updating offer:", error);
    // Clean up uploaded file if update fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Failed to update offer",
      error: error.message,
    });
  }
};

// Delete offer (Admin only)
exports.deleteOffer = async (req, res) => {
  try {
    const { offerId } = req.params;

    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // Delete image from filesystem
    if (offer.offerImage) {
      const imagePath = path.join(__dirname, "..", offer.offerImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Offer.findByIdAndDelete(offerId);

    res.status(200).json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete offer",
      error: error.message,
    });
  }
};

// Toggle offer status (Admin only)
exports.toggleOfferStatus = async (req, res) => {
  try {
    const { offerId } = req.params;

    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    offer.isActive = !offer.isActive;
    await offer.save();

    res.status(200).json({
      success: true,
      message: `Offer ${offer.isActive ? 'activated' : 'deactivated'} successfully`,
      offer,
    });
  } catch (error) {
    console.error("Error toggling offer status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle offer status",
      error: error.message,
    });
  }
};
