const Coupon = require("../models/coupon.model");
const CouponUsage = require("../models/coupon.usage.model");
const Order = require("../models/order.model");


exports.applyCoupon = async (code, userId, orderId) => {

  const coupon = await Coupon.findOne({ code, isActive: true });
  if (!coupon) throw new Error("Invalid or expired coupon");

  const currentDate = new Date();
  if (coupon.expiresAt && coupon.expiresAt < currentDate) {
    throw new Error("Coupon has expired");
  }

  if (coupon.usageLimit && coupon.usedBy.length >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }

  if (coupon.usedBy.includes(userId)) {
    throw new Error("You have already used this coupon");
  }

  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  if (coupon.minOrderAmount && order.totalDiscountedPrice < coupon.minOrderAmount) {
    throw new Error(`Minimum order amount of ₹${coupon.minOrderAmount} required`);
  }

  let discountAmount = 0;
  if (coupon.discountType === "flat") {
    discountAmount = coupon.discountValue;
  } else if (coupon.discountType === "percentage") {
    discountAmount = (coupon.discountValue / 100) * order.totalDiscountedPrice;
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }
  }

  coupon.usedBy.push(userId);
  await coupon.save();

  const usage = new CouponUsage({
    code: coupon.code,
    user: userId,
    order: orderId,
    discountAmount,
  });
  await usage.save();

  return {
    success: true,
    discountAmount,
    message: `Coupon "${code}" applied successfully`,
  };
};

exports.getAllCouponUsage = async () => {
  return await CouponUsage.find()
    .populate("user")
    .populate("order")
    .sort({ createdAt: -1 });
};