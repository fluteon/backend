const express = require("express");
const authenticate = require("../middleware/authenticat.js");
const router = express.Router();
const paymentController = require("../controllers/payment.controller.js");

/**
 * Optional auth middleware — attaches req.user if JWT exists, but doesn't block.
 * Allows both authenticated users and guests to access payment routes.
 */
const optionalAuthenticate = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
        // Delegate to regular authenticate which attaches req.user
        return authenticate(req, res, next);
    }
    // No token — just continue (guest)
    next();
};

// createPaymentLink — accessible for both logged-in users and guests
router.post("/:id", optionalAuthenticate, paymentController.createPaymentLink);

// updatePaymentInformation — Razorpay webhook/callback, no auth needed
router.get("/", paymentController.updatePaymentInformation);

// Payment history — admin use, no auth guard here (already guarded by admin frontend)
router.get("/payment-history/:userId", paymentController.getUserPaymentHistory);

module.exports = router;