
const reviewService = require('../services/review.service.js');

const createReview = async (req, res) => {
  const user = req.user
  const reqBody = req.body;
  
  console.log(`product id ${reqBody.productId} - ${reqBody.review}`);

  try {
    
    const review =await reviewService.createReview(reqBody, user);
        
    return res.status(201).send(review);
  } catch (error) {
    console.log("error --- ", error.message)
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getAllReview = async (req, res) => {
  const productId = req.params.productId;
  console.log("product id ",productId)
  try {
   
    const reviews =await reviewService.getAllReview(productId);
    return res.status(200).send(reviews);
  } catch (error) {
    console.log("error --- ", error.message)
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviewsAdmin();
    return res.status(200).send(reviews);
  } catch (error) {
    console.log("error --- ", error.message);
    return res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

const deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  try {
    await reviewService.deleteReview(reviewId);
    return res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.log("error --- ", error.message);
    return res.status(500).json({ error: 'Failed to delete review' });
  }
};

module.exports = {createReview,getAllReview,getAllReviewsAdmin,deleteReview}
