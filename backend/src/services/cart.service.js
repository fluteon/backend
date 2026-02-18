const Cart = require("../models/cart.model.js");
const CartItem = require("../models/cartItem.model.js");
const Product = require("../models/product.model.js");
const User = require("../models/user.model.js");
const Coupon = require("../models/coupon.model");
const couponModel = require("../models/coupon.model");


// Create a new cart for a user
async function createCart(user) {
  const cart = new Cart({ user });
  const createdCart = await cart.save();
  return createdCart;
}

async function findUserCart(userId) {
  let cart = await Cart.findOne({ user: userId });

  // 🛠️ Create cart if not exists
  if (!cart) {
    cart = await createCart(userId);
  }

  let cartItems = await CartItem.find({ cart: cart._id }).populate("product");

  cart.cartItems = cartItems;

  let totalPrice = 0;
  let totalDiscountedPrice = 0;
  let totalItem = 0;

  for (const cartItem of cart.cartItems) {
    totalPrice += cartItem.price;
    totalDiscountedPrice += cartItem.discountedPrice;
    totalItem += cartItem.quantity;
  }

  cart.totalPrice = totalPrice;
  cart.totalItem = totalItem;
  cart.totalDiscountedPrice = totalDiscountedPrice;
  cart.discounte = totalPrice - totalDiscountedPrice;
cart.couponCode = cart.couponCode;
cart.couponDiscount = cart.couponDiscount;
  return cart;
}


// Add an item to the user's cart
async function addCartItem(userId, req) {
 
  const cart = await Cart.findOne({ user: userId });
  const product = await Product.findById(req.productId);

  const isPresent = await CartItem.findOne({ cart: cart._id, product: product._id, userId });
  

  if (!isPresent) {
    const cartItem = new CartItem({
      product: product._id,
      cart: cart._id,
      quantity: 1,
      userId,
      price: product.discountedPrice,
      size: req.size,
      discountedPrice:product.discountedPrice
    });

   

    const createdCartItem = await cartItem.save();
    cart.cartItems.push(createdCartItem);
    await cart.save();
  }

  return 'Item added to cart';
}


// Updated applyCoupon() without orderId dependency
const applyCoupon = async (code, userId, cartId, cartTotal) => {
  const coupon = await Coupon.findOne({ code, isActive: true });
  if (!coupon) throw new Error("Invalid or expired coupon");

  if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
    throw new Error(`Minimum order amount of ₹${coupon.minOrderAmount} required`);
  }

  let discountAmount = 0;

  if (coupon.discountType === "flat") {
    discountAmount = coupon.discountValue;
  } else if (coupon.discountType === "percentage") {
    discountAmount = (coupon.discountValue / 100) * cartTotal;
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }
  }

  const finalPayableAmount = Math.floor(cartTotal - discountAmount);

  // ✅ Save coupon to cart
  const cart = await Cart.findById(cartId);
  cart.couponCode = coupon.code;
  cart.couponDiscount = Math.floor(discountAmount);
  await cart.save();

  return {
    success: true,
    code: coupon.code,
    discountAmount: Math.floor(discountAmount),
    originalTotal: cartTotal,
    finalPayableAmount,
    difference: Math.floor(discountAmount),
    message: `Coupon "${code}" applied successfully`,
  };
};

const allCoupon = async () => {
  return await Coupon.find().sort({ createdAt: -1 });
};

module.exports = { createCart, findUserCart, addCartItem,applyCoupon, allCoupon  };
