const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, sparse: true }, // Made optional and sparse
  mobile: { type: String, sparse: true }, // Added mobile support
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // 10 minutes TTL
  attempts: { type: Number, default: 0 },
  blockedUntil: { type: Date, default: null },
  verificationType: { type: String, enum: ['email', 'mobile'], required: true } // Track verification type
});

// Compound indexes to ensure uniqueness per type
otpSchema.index({ email: 1, verificationType: 1 }, { unique: true, sparse: true });
otpSchema.index({ mobile: 1, verificationType: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Otp", otpSchema);