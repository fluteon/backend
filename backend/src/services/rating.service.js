const Rating = require("../models/rating.model.js");
const productService = require("../services/product.service.js");

async function createRating(req, user) {
  const product = await productService.findProductById(req.productId);

  const rating = new Rating({
    product: product._id,
    user: user._id,
    rating: req.rating,
    createdAt: new Date(),
  });

  return await rating.save();
}

async function getProductsRating(productId) {
  return await Rating.find({ product: productId });
}

// ✅ Add rating summary function
async function getProductRatingSummary(productId) {
  const ratings = await Rating.find({ product: productId });
  if (!ratings.length) return null;

  const summary = {
    total: ratings.length,
    average: 0,
    breakdown: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  };

  let sum = 0;
  for (const r of ratings) {
    summary.breakdown[r.rating]++;
    sum += r.rating;
  }
  summary.average = (sum / ratings.length).toFixed(1);

  return summary;
}

module.exports = {
  createRating,
  getProductsRating,
  getProductRatingSummary,
};
