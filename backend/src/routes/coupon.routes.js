const express = require("express");
const router = express.Router();
const couponController = require("../controllers/coupon.controller");

// User: Apply a coupon (during checkout)
router.post("/apply", couponController.applyCoupon);

// Admin: Get all usage logs
router.get("/usages", couponController.getCouponUsage);
router.post("/create", couponController.createCoupon);
router.get("/all_coupon", couponController.getAllCoupons);
router.delete("/delete/:id",couponController.deleteCoupon)
router.put("/update/:id",couponController.updateCoupon)


module.exports = router;
