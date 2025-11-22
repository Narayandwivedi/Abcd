const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const { handlePassportPhotoUpload } = require('../controllers/uploadController');

// Auth middleware - uncomment when ready to use
// const { authenticate } = require('../middleware/auth');

/**
 * UPLOAD ROUTES
 * All routes accept image files (JPEG, JPG, PNG, WebP)
 * Max file size: 10MB
 */

// Upload passport photo (for admin panel user creation)
router.post('/passport-photo', upload.single('passportPhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Process and save the passport photo
    const passportPhotoPath = await handlePassportPhotoUpload(req.file);

    return res.status(200).json({
      success: true,
      message: 'Passport photo uploaded successfully',
      passportPhoto: passportPhotoPath
    });
  } catch (error) {
    console.error('Upload passport photo error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload passport photo'
    });
  }
});

module.exports = router;
