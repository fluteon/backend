const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ["percentage", "flat"], required: true },
  discountValue: { type: Number, required: true },
  maxDiscountAmount: { type: Number }, // optional for percentage type
  minOrderAmount: { type: Number, default: 0 },
  usageLimit: { type: Number }, // total number of times coupon can be used
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }], // track users
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

module.exports = mongoose.model("coupons", couponSchema);
