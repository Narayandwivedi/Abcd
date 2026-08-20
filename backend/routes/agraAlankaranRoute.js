const express = require("express");
const router = express.Router();
const upload = require("../utils/agraAlankaranMulter");
const { submitApplication } = require("../controllers/agraAlankaranController");

// Submit application route
router.post(
  "/submit",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "documents", maxCount: 10 }
  ]),
  submitApplication
);

module.exports = router;
