const mongoose = require("mongoose");

/**
 * WhatsApp OTP schema - keyed by mobile number.
 * Kept separate from the existing email OTP model (otpSchema.js)
 * to avoid any interference.
 */
const whatsappOtpSchema = new mongoose.Schema({
    mobile: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 }, // TTL: 10 minutes auto-delete
    attempts: { type: Number, default: 0 },
    blockedUntil: { type: Date, default: null },
});

module.exports = mongoose.model("WhatsappOtp", whatsappOtpSchema);
