const express = require('express');
const { submitApplication, verifyReferralCode, getAllApplications, rejectApplication } = require('../controllers/vendorApplicationController');
const upload = require('../utils/multer');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.post('/submit', upload.single('paymentScreenshot'), submitApplication);
router.get('/verify-referral/:code', verifyReferralCode);
router.get('/all', adminAuth, getAllApplications);
router.put('/:id/reject', adminAuth, rejectApplication);

module.exports = router;
