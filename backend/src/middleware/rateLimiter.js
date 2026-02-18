const rateLimit = require('express-rate-limit');

// General API rate limiter - 1000 requests per 15 minutes per IP
// ⚠️ Increased from 100 to 1000 for development/testing
// Products, browsing, and normal operations need higher limits
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // ✅ Increased from 100 to allow normal browsing
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for auth routes - 5 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    message: 'Too many authentication attempts, please try again after 15 minutes',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// OTP limiter - 3 requests per 10 minutes per IP
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  message: {
    message: 'Too many OTP requests, please try again after 10 minutes',
    retryAfter: '10 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Password reset limiter - 3 requests per hour per IP
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    message: 'Too many password reset attempts, please try again after 1 hour',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Payment limiter - 10 requests per hour per IP
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    message: 'Too many payment requests, please try again later',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Review/Rating limiter - 5 per hour per IP
const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    message: 'Too many review submissions, please try again later',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  otpLimiter,
  passwordResetLimiter,
  paymentLimiter,
  reviewLimiter
};
