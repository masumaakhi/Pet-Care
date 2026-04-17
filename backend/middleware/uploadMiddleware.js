// backend/middleware/uploadMiddleware.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");

// Base upload directory
const baseDir = path.join(__dirname, "..", "uploads");

const getSubDir = (originalUrl = "") => {
  if (originalUrl.includes("pets")) return "pets";
  if (originalUrl.includes("rescues")) return "rescues";
  if (originalUrl.includes("adoptions")) return "adoptions";
  if (originalUrl.includes("community")) return "community";
  return "others";
};

// Storage configuration
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDir = getSubDir(req.originalUrl);

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

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const subDir = getSubDir(req.originalUrl);
    return {
      folder: `pet-care/${subDir}`,
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: `${subDir}-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    };
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
  storage: isCloudinaryConfigured ? cloudinaryStorage : diskStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB Limit
  fileFilter,
});

module.exports = upload;
