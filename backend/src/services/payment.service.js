const razorpay = require("../config/razorpayClient");
const PaymentInformation = require("../models/payment.information.js");
const User = require("../models/user.model.js");
const orderService=require("../services/order.service.js");
const mongoose = require("mongoose")

const createPaymentLink = async (orderId) => {
  try {
       console.log("Searching for Order with ID:", orderId);
    console.log("Is valid ObjectId?", mongoose.Types.ObjectId.isValid(orderId));
    const order = await orderService.findOrderById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    // Check if payment already exists for this order
    const existingPayment = await PaymentInformation.findOne({ order: order._id });
    if (existingPayment) {
      throw new Error("Payment already exists for this order");
    }

    const user = await User.findById(order.user);
    if (!user) {
      throw new Error("User not found for this order");
    }

    const paymentLinkRequest = {
      amount: order.totalDiscountedPrice * 100,
      currency: "INR",
      customer: {
        name: user.firstName + " " + user.lastName,
        contact: user.mobile,
        email: user.email,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      callback_url: `https://fluteon.com/payment/${orderId}`,
      callback_method: "get",
    };

    const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);

    return {
      paymentLinkId: paymentLink.id,
      payment_link_url: paymentLink.short_url,
    };
  } catch (error) {
    console.error("Error creating payment link (service):", error);
    throw new Error(error.message);
  }
};


const updatePaymentInformation = async (reqData) => {
  const paymentId = reqData.payment_id;
  const orderId = reqData.order_id;

  try {
    const order = await orderService.findOrderById(orderId);
    if (!order) throw new Error("Order not found");

    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status === "captured") {
      // ✅ Check if a payment already exists for this order
      const existingPayment = await PaymentInformation.findOne({ order: order._id });
      if (existingPayment) {
        console.log("Payment info already exists for this order");
        return {
          message: "Payment info already recorded",
          orderId: order._id,
          paymentId: existingPayment._id,
        };
      }

      // Update order
      order.paymentDetails.paymentId = paymentId;
      order.paymentDetails.paymentStatus = "COMPLETED";
      order.paymentDetails.paymentMethod = payment.method;
      order.paymentDetails.transactionId = payment.acquirer_data?.bank_transaction_id || "";
      order.orderStatus = "PLACED";

      // await order.save();
await orderService.placedOrder(orderId);
      // Create new payment record
      const user = await User.findById(order.user);
      const paymentInfo = new PaymentInformation({
        user: user._id,
        userSnapshot: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
        },
        order: order._id,
        paymentId,
        status: "COMPLETED",
        amount: payment.amount / 100,
        paidAt: new Date(),
      });

      await paymentInfo.save();

      // Update user with payment ref
      user.paymentInformation.push(paymentInfo._id);
      await user.save();

      return {
        message: "Order placed & payment recorded",
        orderId: order._id,
        paymentId: paymentInfo._id,
      };
    } else {
      throw new Error("Payment not captured");
    }
  } catch (error) {
    console.error("Error in updatePaymentInformation:", error);
    throw new Error(error.message);
  }
};



// ✅ services/payment.service.js
const getUserPaymentHistory = async (userId, orderId = null) => {
  try {
    const query = { user: userId };
    if (orderId) query.order = orderId;

    const history = await PaymentInformation.find(query)
      .populate([
        {
          path: "order",
          model: "orders", // ✅ ensure this matches your Order model name
          populate: [
            {
              path: "user",
              model: "users", // ✅ ensure correct model name
            },
            {
              path: "orderItems",
              populate: {
                path: "product",
                model: "products", // ✅ ensure correct model name
              },
            },
          ],
        },
        {
          path: "user",
          model: "users",
        },
      ])
      .sort({ paidAt: -1 });

    return history;
  } catch (error) {
    console.error("Error fetching user payment history (service):", error);
    throw new Error(error.message);
  }
};






module.exports={createPaymentLink,updatePaymentInformation,getUserPaymentHistory,}