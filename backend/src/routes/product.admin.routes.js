const express=require("express");
const router=express.Router();
const productController=require("../controllers/product.controller.js");
const upload = require("../middleware/upload.js");
const multer = require("multer");

// Allowed file fields for product routes
const productFields = [
  { name: "images", maxCount: 10 },
  { name: "sizeChart", maxCount: 1 },
  { name: "colorSwatch", maxCount: 1 }
];

// Wrapper: catches multer errors (e.g. LIMIT_UNEXPECTED_FILE) and returns 400
function uploadMiddleware(req, res, next) {
  upload.fields(productFields)(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Upload error: ${err.message} (field: ${err.field || 'unknown'})` });
      }
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }
    next();
  });
}

router.post('/', uploadMiddleware, productController.createProduct);
router.post('/creates', productController.createMultipleProduct);
router.delete('/:id', productController.deleteProduct);
router.put('/:id', uploadMiddleware, productController.updateProduct);

module.exports=router;