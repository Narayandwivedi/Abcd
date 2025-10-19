const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const { uploadPaymentScreenshot } = require('../controllers/uploadController');
// Assuming you have an auth middleware - adjust the path as needed
// const { authenticate } = require('../middlewares/auth');

// Route to upload payment screenshot
// Add your authentication middleware here: router.post('/payment-screenshot', authenticate, upload.single('paymentImage'), uploadPaymentScreenshot);
router.post('/payment-screenshot', upload.single('paymentImage'), uploadPaymentScreenshot);

module.exports = router;
