const express = require("express");
const router = express.Router();
const { createGuestOrder, getGuestOrder } = require("../controllers/guestOrder.controller.js");

// No authentication required for guest orders
router.post("/", createGuestOrder);
router.get("/:id", getGuestOrder);

module.exports = router;
