const express=require("express");
const router=express.Router();

const cartService=require("../services/cart.service.js");



const findUserCart = async (req, res) => {
    try {
      const user = req.user;
      const cart = await cartService.findUserCart(user.id);
      res.status(200).json(cart);
    } catch (error) {
      // Handle error here and send appropriate response
      res.status(500).json({ message: "Failed to get user cart.", error: error.message });
    }
}
  

  const addItemToCart = async (req, res) => {
    try {
      const user = req.user;
      await cartService.addCartItem(user._id.toString(), req.body);
     
      res.status(202).json({message:"Item Added To Cart Successfully", status:true});
    } catch (error) {
      // Handle error here and send appropriate response
      res.status(500).json({ message: "Failed to add item to cart.", error: error.message });
    }
  }

  applyCouponToCart = async (req, res) => {
  try {
    const { code, userId, cartId, cartTotal } = req.body;

    const result = await cartService.applyCoupon(code, userId, cartId, cartTotal); // ✅ must be a defined function
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to apply coupon" });
  }
};

const allCoupon = async (req, res) => {
  try {
    const allCoupons = await cartService.allCoupon(); // 👈 call the function
    res.status(200).json({ success: true, message: "Coupons fetched successfully", coupons: allCoupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

  module.exports={findUserCart,addItemToCart, applyCouponToCart, allCoupon};