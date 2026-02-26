const express = require("express");

const router = express.Router();
const authController = require("../controllers/auth.controller.js")
const {
  verifyEmailService,
  confirmOtpService,
  sendResetOtpService,
  resetPasswordService,
  sendWhatsAppOtpService,
  verifyWhatsAppOtpService,
} = require("../services/user.service.js");
const { authLimiter, otpLimiter, passwordResetLimiter } = require("../middleware/rateLimiter.js");
const {
  registerValidation,
  loginValidation,
  otpValidation,
  otpVerifyValidation,
  whatsappOtpValidation,
  whatsappOtpVerifyValidation,
} = require("../middleware/validators.js");
const { sanitizeError, errorMessages } = require("../utils/errorHandler.js");



router.post("/signup", authLimiter, registerValidation, authController.register)
router.post("/signin", authLimiter, loginValidation, authController.login)


router.post("/send-otp", otpLimiter, otpValidation, async (req, res) => {
  try {
    const { email } = req.body;
    const result = await verifyEmailService(email);
    res.json(result);
  } catch (err) {
    const safeMessage = sanitizeError(err, errorMessages.otp.send);
    res.status(400).json({ message: safeMessage });
  }
});

router.post("/verify-otp", authLimiter, otpVerifyValidation, async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await confirmOtpService(email, otp);
    res.json(result);
  } catch (err) {
    const safeMessage = sanitizeError(err, errorMessages.otp.verify);
    res.status(400).json({ message: safeMessage });
  }
});

router.post("/send-reset-otp", passwordResetLimiter, otpValidation, async (req, res) => {
  try {
    const response = await sendResetOtpService(req.body.email);
    res.json(response);
  } catch (e) {
    const safeMessage = sanitizeError(e, errorMessages.auth.reset);
    res.status(400).json({ message: safeMessage });
  }
});

router.post("/reset-password", passwordResetLimiter, otpVerifyValidation, async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const response = await resetPasswordService(email, newPassword);
    res.json(response);
  } catch (e) {
    const safeMessage = sanitizeError(e, errorMessages.auth.reset);
    res.status(400).json({ message: safeMessage });
  }
});


// ─── WhatsApp OTP – Send ───────────────────────────────────────────────────
router.post("/send-whatsapp-otp", otpLimiter, whatsappOtpValidation, async (req, res) => {
  try {
    const { mobile } = req.body;
    const result = await sendWhatsAppOtpService(mobile);
    res.json(result);
  } catch (err) {
    const safeMessage = sanitizeError(err, "Failed to send WhatsApp OTP.");
    res.status(400).json({ message: safeMessage });
  }
});

// ─── WhatsApp OTP – Verify ─────────────────────────────────────────────────
router.post("/verify-whatsapp-otp", otpLimiter, whatsappOtpVerifyValidation, async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const result = await verifyWhatsAppOtpService(mobile, otp);
    res.json(result);
  } catch (err) {
    const safeMessage = sanitizeError(err, "Failed to verify WhatsApp OTP.");
    res.status(400).json({ message: safeMessage });
  }
});

module.exports = router;