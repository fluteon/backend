const express=require("express");
const router=express.Router();
const productController=require("../controllers/product.controller.js");
const upload = require("../middleware/upload.js");
const sizeChart = require("../models/sizeChart.js");


router.post('/', upload.array("images", 4),productController.createProduct);
router.post('/creates', productController.createMultipleProduct);
router.delete('/:id', productController.deleteProduct);
router.put(
  '/:id',
  upload.fields([{ name: "images", maxCount: 4 }]),
  productController.updateProduct
);
// routes/sizeChart.route.js
router.get("/:category", async (req, res) => {
  try {
    const chart = await sizeChart.findOne({ category: req.params.category });
    if (!chart) return res.status(404).json({ message: "No size chart found" });
    res.json(chart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports=router;