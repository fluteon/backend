// middleware/upload.js
const multer = require("multer");

const storage = multer.memoryStorage(); // store in memory for Cloudinary upload

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { 
    files: 12, // 10 product images + 1 size chart + 1 color swatch
    fileSize: 10 * 1024 * 1024 // 10MB per file
  },
  fileFilter: fileFilter
});

module.exports = upload;
