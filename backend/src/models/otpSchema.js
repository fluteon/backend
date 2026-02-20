const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // 10 minutes TTL
  attempts: { type: Number, default: 0 },
  blockedUntil: { type: Date, default: null }
});

module.exports = mongoose.model("Otp", otpSchema);