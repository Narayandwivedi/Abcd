const express = require('express');
const { submitApplication, verifyReferralCode } = require('../controllers/vendorApplicationController');
const upload = require('../utils/multer');

const router = express.Router();

router.post('/submit', upload.single('paymentScreenshot'), submitApplication);
router.get('/verify-referral/:code', verifyReferralCode);

module.exports = router;
