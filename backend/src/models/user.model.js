const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    required:true,
    default:"CUSTOMER"
  },
  mobile: {
    type: String,
  },
  addresses: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "addresses",
    },
  ], 
  paymentInformation: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment_information",
    },
  ],
  superCoins:{
    type:Number,
    default:0
  },

  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ratings",
    },
  ], 
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reviews",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Database indexes for performance
userSchema.index({ email: 1 }, { unique: true }); // Email lookup and uniqueness
userSchema.index({ mobile: 1 }); // Mobile number lookup
userSchema.index({ createdAt: -1 }); // Recent users

const User = mongoose.model("users", userSchema);

module.exports = User;
