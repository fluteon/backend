const express=require("express");
const router=express.Router();
const productController=require("../controllers/product.controller.js");
const upload = require("../middleware/upload.js");


router.post('/', upload.array("images", 4),productController.createProduct);
router.post('/creates', productController.createMultipleProduct);
router.delete('/:id', productController.deleteProduct);
router.put('/:id', productController.updateProduct);

module.exports=router;