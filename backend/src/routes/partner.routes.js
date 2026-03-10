const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticat.js");
const {
  createPartner,
  getAllPartners,
  updatePartnerStatus,
  deletePartner,
} = require("../controllers/partner.controller.js");
const { partnerLimiter } = require("../middleware/rateLimiter.js");

// Public — submit partner application (rate limited)
router.post("/", partnerLimiter, createPartner);

// Admin — list all partner applications
router.get("/", authenticate, getAllPartners);

// Admin — update partner status
router.put("/:id/status", authenticate, updatePartnerStatus);

// Admin — delete partner application
router.delete("/:id", authenticate, deletePartner);

module.exports = router;
