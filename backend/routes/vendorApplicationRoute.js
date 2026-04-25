const express = require('express');
const { submitApplication } = require('../controllers/vendorApplicationController');

const router = express.Router();

router.post('/submit', submitApplication);

module.exports = router;
