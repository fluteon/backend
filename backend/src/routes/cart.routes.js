
const express = require("express");
const authenticate = require("../middleware/authenticat.js");
const cartController = require("../controllers/cart.controller.js");
const { applyCouponToCart } = require("../services/cart.service.js");

const router = express.Router();

router.get("/", authenticate, cartController.findUserCart);
router.put("/add", authenticate, cartController.addItemToCart);
router.post("/apply-cart-coupon", authenticate, cartController.applyCouponToCart);
router.get("/all-coupon",authenticate,cartController.allCoupon)
module.exports = router;






