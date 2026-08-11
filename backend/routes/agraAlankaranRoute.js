const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const { submitApplication } = require("../controllers/agraAlankaranController");

// Submit application route
router.post(
  "/submit",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "document", maxCount: 1 }
  ]),
  submitApplication
);

module.exports = router;
