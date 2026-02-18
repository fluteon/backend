// models/payment_information.js
const mongoose = require("mongoose");

const paymentInformationSchema = new mongoose.Schema({
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "users",
  required: true,
},
userSnapshot: {
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
},
order: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "orders", // 👈 must match your Order model name
},

  paymentId: {
    type: String,
    required: true,
  },
  status: {
    type: String, // e.g., "COMPLETED", "FAILED"
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paidAt: {
    type: Date,
    default: Date.now,
  },
});

const PaymentInformation = mongoose.model("payment_information", paymentInformationSchema);

module.exports = PaymentInformation;
