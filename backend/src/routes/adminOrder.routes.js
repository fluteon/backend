const express=require("express");
const authenticate = require("../middleware/authenticat.js");
const router=express.Router();
const adminOrderController=require("../controllers/adminOrder.controller.js")

router.get("/",adminOrderController.getAllOrders);
router.put("/:orderId/confirmed",adminOrderController.confirmedOrder);
router.put("/:orderId/ship",adminOrderController.shippOrder);
router.put("/:orderId/deliver",adminOrderController.deliverOrder);
router.put("/:orderId/cancel",adminOrderController.cancelledOrder);
router.delete("/:orderId/delete",adminOrderController.deleteOrder);
router.put("/:orderId/out-for-delivery",adminOrderController.outForDelivery);
router.put("/:orderId/return/approve", adminOrderController.approveReturnOrder)

router.get("/overview", adminOrderController.getAdminDashboardOverview);
module.exports=router;