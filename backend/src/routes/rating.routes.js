const express = require("express");
const authenticate = require("../middleware/authenticat.js");
const router = express.Router();
const ratingController = require("../services/rating.service.js");

router.get("/create",authenticate,ratingController.createRating);
router.put("/product/:productId",authenticate,ratingController.getProductsRating);

router.get("/summary/:productId", async (req, res) => {
  try {
    const summary = await ratingController.getProductRatingSummary(req.params.productId);
    res.json(summary || { total: 0, average: 0, breakdown: {} });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports=router;