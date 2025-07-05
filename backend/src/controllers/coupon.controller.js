const couponService = require("../services/coupon.services.js")

exports.applyCoupon = async (req, res) => {
  try {
    const { code, userId, orderId } = req.body;
    const result = await couponService.applyCoupon(code, userId, orderId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: View coupon usage
exports.getCouponUsage = async (req, res) => {
  try {
    const data = await couponService.getAllCouponUsage();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};