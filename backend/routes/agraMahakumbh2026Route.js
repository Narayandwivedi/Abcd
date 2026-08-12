const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const { submitRegistration } = require("../controllers/agraMahakumbh2026Controller");

// Submit registration route
router.post(
  "/submit",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "paymentScreenshot", maxCount: 1 }
  ]),
  submitRegistration
);

module.exports = router;