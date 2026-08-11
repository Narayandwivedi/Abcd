const express = require('express');
const { submitApplication, verifyReferralCode, getAllApplications } = require('../controllers/userApplicationController');
const upload = require('../utils/multer');

const router = express.Router();

router.post('/submit', upload.single('paymentScreenshot'), submitApplication);
router.get('/verify-referral/:code', verifyReferralCode);
router.get('/all', getAllApplications);

module.exports = router;
