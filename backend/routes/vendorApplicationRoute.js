const express = require('express');
const { submitApplication } = require('../controllers/vendorApplicationController');
const upload = require('../utils/multer');

const router = express.Router();

router.post('/submit', upload.single('paymentScreenshot'), submitApplication);

module.exports = router;
