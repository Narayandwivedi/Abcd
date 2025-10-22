const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const paymentDir = path.join(__dirname, "..", "uploads", "payment-screenshots");
const passportDir = path.join(__dirname, "..", "uploads", "passport-photos");
const tempDir = path.join(__dirname, "..", "uploads", "temp");

[paymentDir, passportDir, tempDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// File filter to accept only images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

// Temporary storage for all uploads (will be processed and moved)
const tempStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "temp-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Configure multer for general image uploads
const upload = multer({
  storage: tempStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: imageFilter,
});

module.exports = upload;
