const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    // required: true,
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'addresses',
  },
  paymentDetails: {
    
    paymentMethod: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    paymentId:{
      type:String,
    },
    paymentStatus:{
      type:String
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
returnTime:{
  type:"String"
},
rejectionMessage: {
  type: String,
  default: "",
},
usedSuperCoins:{
  type:Number,
  default:0
},
earnedSuperCoins:{
  type:Number,
  default:0
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

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
