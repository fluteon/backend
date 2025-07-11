const express=require("express");
const authenticate = require("../middleware/authenticat.js");
const router=express.Router();
const orderController=require("../controllers/order.controller.js")
const adminOrderController=require("../controllers/adminOrder.controller.js");
const upload = require("../middleware/upload.js");

router.post("/",authenticate,orderController.createOrder);
router.get("/user",authenticate,orderController.orderHistory);
router.get("/:id",authenticate,orderController.findOrderById);
router.put("/:orderId/return", upload.array("images", 4), adminOrderController.returnOrder)


module.exports=router;