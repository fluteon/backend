const couponService = require("../services/coupon.services");

exports.createCoupon = async (req, res) => {
  try {
    const created = await couponService.createCoupon(req.body);
    res.status(201).json({
      success: true,
      message: "Coupon created",
      coupon: created,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllCoupons = async (req, res) => {
  try {
    const allCoupons = await couponService.getAllCoupons();
    res.status(200).json({ success: true, coupons: allCoupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCouponUsage = async (req, res) => {
  try {
    const usages = await couponService.getAllCouponUsage();
    res.status(200).json({ success: true, usageHistory: usages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.applyCoupon = async (req, res) => {
  const { code, userId, orderId } = req.body;
  try {
    const result = await couponService.applyCoupon(code, userId, orderId);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
