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
    files: 4, // Max 4 images
    fileSize: 5 * 1024 * 1024 // 5MB per file
  },
  fileFilter: fileFilter
});

module.exports = upload;
