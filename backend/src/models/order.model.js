const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    default: null,
  },
  isGuestOrder: {
    type: Boolean,
    default: false,
  },
  guestInfo: {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
  },
  orderItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'orderItems',
  }],
  orderDate: {
    type: Date,
    required: true,
  },
  deliveryDate: {
    type: Date,
  },
  statusUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  shippingAddress: {
    type: mongoose.Schema.Types.Mixed, // supports both ObjectId ref and inline object (for guests)
  },
  paymentDetails: {

    paymentMethod: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    paymentId: {
      type: String,
    },
    paymentStatus: {
      type: String
    }

  },
  totalPrice: {
    type: Number,
    required: true,
  },
  totalDiscountedPrice: {
    type: Number,
    required: true,
  },
  discounte: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
  },
  totalItem: {
    type: Number,
    required: true,
  },
  returnRequestedAt: {
    type: Date,
  },
  returnRejectedAt: {
    type: Date,
  },
  returnReason: {
    type: String,
  },
  returnDescription: String,
  returnImages: [String],
  adminNote: {
    type: String,
  },
  returnTime: {
    type: "String"
  },
  rejectionMessage: {
    type: String,
    default: "",
  },
  usedSuperCoins: {
    type: Number,
    default: 0
  },
  earnedSuperCoins: {
    type: Number,
    default: 0
  },
  couponCode: {
    type: String,
    default: null,
  },
  couponDiscount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Database indexes for performance optimization
orderSchema.index({ user: 1, createdAt: -1 }); // User's orders sorted by date
orderSchema.index({ orderStatus: 1 }); // Filter by order status
orderSchema.index({ 'paymentDetails.paymentStatus': 1 }); // Filter by payment status
orderSchema.index({ createdAt: -1 }); // Recent orders

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
