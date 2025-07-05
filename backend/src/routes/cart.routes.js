const express = require("express");
const authenticate = require("../middleware/authenticat.js");
const cartController = require("../controllers/cart.controller.js");

const router = express.Router();

router.get("/", authenticate, cartController.findUserCart);
router.put("/add", authenticate, cartController.addItemToCart);

module.exports = router;