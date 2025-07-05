const Review = require("../models/review.model.js");
const productService=require("../services/product.service.js")

// async function createReview(reqData, user) {
//   // console.log("req data ",reqData)
//   const product = await productService.findProductById(reqData.productId);

//   if(!product){
//     throw new Error("product not found with id ", reqData.productId)
//   }
  
//   const review = new Review({
//     user: user._id,
//     product: product._id,
//     review: reqData.review,
//     createdAt: new Date(),
//   });
  
//   await product.save();
//   return await review.save();
// }

async function createReview(reqData, user) {
  const product = await productService.findProductById(reqData.productId);

  if (!product) {
    throw new Error("Product not found with id " + reqData.productId);
  }

  const review = new Review({
    user: user._id,
    product: product._id,
    review: reqData.review,
    description: reqData.description, // ✅ Save description
    rating: reqData.rating, // ✅ Also save rating
    createdAt: new Date(),
  });

  return await review.save(); // ✅ No need to save product here
}

// async function getAllReview(productId) {
//   const product = await productService.findProductById(productId);

//   if(!product){
//     throw new Error("product not found with id ", productId)
//   }
  
//   const reviews = await Review.find({ product: productId }).populate("user");
//   console.log("reviews ",reviews)
//   return reviews
// }

async function getAllReview(productId) {
  const product = await productService.findProductById(productId);
  if (!product) {
    throw new Error("Product not found with id " + productId);
  }

  const reviews = await Review.find({ product: productId }).populate("user");

  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;

  for (const review of reviews) {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating]++;
      totalRating += review.rating;
    }
  }

  const totalRatings = Object.values(ratingCounts).reduce((a, b) => a + b, 0);
  const averageRating = totalRatings > 0 ? (totalRating / totalRatings).toFixed(1) : 0;

  return {
    reviews,
    ratingSummary: {
      counts: ratingCounts,
      totalRatings,
      averageRating: Number(averageRating),
    },
  };
}


module.exports = {
  createReview,
  getAllReview,
};
