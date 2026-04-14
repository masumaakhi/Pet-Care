// backend/middleware/uploadMiddleware.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Base upload directory
const baseDir = path.join(__dirname, "..", "uploads");

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine subdirectory based on route or custom logic
    let subDir = "others";
    if (req.originalUrl.includes("pets")) subDir = "pets";
    if (req.originalUrl.includes("rescues")) subDir = "rescues";
    if (req.originalUrl.includes("adoptions")) subDir = "adoptions";
    if (req.originalUrl.includes("community")) subDir = "community";

    const targetDir = path.join(baseDir, subDir);
    
    // Ensure directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const prefix = req.originalUrl.includes("rescues")
      ? "rescue"
      : req.originalUrl.includes("adoptions")
        ? "adoption"
        : "upload";
    cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter (Images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG and WebP files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB Limit
  fileFilter,
});

module.exports = upload;
