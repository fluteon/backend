const express = require("express");
const authenticate = require("../middleware/authenticat.js");
const router = express.Router();
const reviewController = require("../controllers/review.controller.js");

router.post("/create",authenticate,reviewController.createReview);
router.get("/product/:productId",reviewController.getAllReview); // No auth needed to view reviews

// Admin routes
router.get("/all",authenticate,reviewController.getAllReviewsAdmin);
router.delete("/:reviewId",authenticate,reviewController.deleteReview);

module.exports=router;