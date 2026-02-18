const express=require("express");

const router=express.Router();
const authController=require("../controllers/auth.controller.js")
const {
  verifyEmailService, 
  confirmOtpService,
  verifyMobileService,
  confirmMobileOtpService,
  sendResetOtpService, 
  sendResetMobileOtpService,
  resetPasswordService,
  resetPasswordWithMobileService
} = require("../services/user.service.js")
const { authLimiter, otpLimiter, passwordResetLimiter } = require("../middleware/rateLimiter.js");
const { registerValidation, loginValidation, otpValidation, otpVerifyValidation } = require("../middleware/validators.js");
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

// ============================================
// 📱 MOBILE OTP ROUTES
// ============================================

// Send mobile OTP for registration
router.post("/send-mobile-otp", otpLimiter, async (req, res) => {
  try {
    const { mobile } = req.body;
    
    // Validate mobile format (international format with + sign)
    if (!mobile || !/^\+\d{10,15}$/.test(mobile)) {
      return res.status(400).json({ 
        message: "Invalid mobile number format. Use international format: +1234567890" 
      });
    }
    
    const result = await verifyMobileService(mobile);
    res.json(result);
  } catch (err) {
    const safeMessage = sanitizeError(err, "Failed to process mobile OTP request");
    res.status(400).json({ message: safeMessage });
  }
});

// Verify mobile OTP for registration
router.post("/verify-mobile-otp", authLimiter, async (req, res) => {
  try {
    const { mobile, otp, firebaseToken } = req.body;
    
    if (!mobile || !otp) {
      return res.status(400).json({ message: "Mobile number and OTP are required" });
    }
    
    const result = await confirmMobileOtpService(mobile, otp, firebaseToken);
    res.json(result);
  } catch (err) {
    const safeMessage = sanitizeError(err, "OTP verification failed");
    res.status(400).json({ message: safeMessage });
  }
});

// Send mobile OTP for password reset
router.post("/send-reset-mobile-otp", passwordResetLimiter, async (req, res) => {
  try {
    const { mobile } = req.body;
    
    if (!mobile || !/^\+\d{10,15}$/.test(mobile)) {
      return res.status(400).json({ 
        message: "Invalid mobile number format" 
      });
    }
    
    const response = await sendResetMobileOtpService(mobile);
    res.json(response);
  } catch (e) {
    const safeMessage = sanitizeError(e, "Failed to send reset OTP");
    res.status(400).json({ message: safeMessage });
  }
});

// Reset password using mobile OTP
router.post("/reset-password-mobile", passwordResetLimiter, async (req, res) => {
  try {
    const { mobile, newPassword } = req.body;
    
    if (!mobile || !newPassword) {
      return res.status(400).json({ message: "Mobile number and new password are required" });
    }
    
    const response = await resetPasswordWithMobileService(mobile, newPassword);
    res.json(response);
  } catch (e) {
    const safeMessage = sanitizeError(e, "Password reset failed");
    res.status(400).json({ message: safeMessage });
  }
});


module.exports=router;