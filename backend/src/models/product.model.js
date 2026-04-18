// productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  price: {
    type: Number,
    // required: true,
  },
  discountedPrice: {
    type: Number,
  },
  discountPersent: {
    type: Number,
  },
  quantity: {
    type: Number,
    // required: true,
  },
  brand: {
    type: String,
  },
  color: {
    type: [String],
  },
  sizes: [{
    name:{type:String},
    quantity:{type:Number}
  }], 
imageUrl: {
  type: [String],
  validate: [arr => arr.length <= 10, 'Maximum 10 images allowed'],
},
sizeChartUrl: {
  type: String,
  default: null,
},
colorSwatchUrl: {
  type: String,
  default: null,
},

  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ratings',
    },
  ], 
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'reviews',
    },
  ], 
  numRatings: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
  }, 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Database indexes for performance optimization
productSchema.index({ category: 1, brand: 1 }); // Compound index for filtering
productSchema.index({ price: 1, discountedPrice: 1 }); // Index for price sorting
productSchema.index({ title: 'text', description: 'text' }); // Text search index
productSchema.index({ createdAt: -1 }); // Index for newest products
productSchema.index({ numRatings: -1 }); // Index for popular products

const Product = mongoose.model('products', productSchema);

module.exports = Product;
