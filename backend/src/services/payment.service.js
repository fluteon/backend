const razorpay = require("../config/razorpayClient");
const PaymentInformation = require("../models/payment.information.js");
const User = require("../models/user.model.js");
const orderService=require("../services/order.service.js");
const mongoose = require("mongoose")

const createPaymentLink = async (orderId, usedSuperCoins = 0) => {
  try {
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

    // 🪙 Super Coin Calculation
    const discountFromCoins = usedSuperCoins * 1; // ₹1 per coin
    const finalAmount = Math.max(order.totalDiscountedPrice - discountFromCoins, 0);

    // 💾 Save usedSuperCoins in the order
    order.usedSuperCoins = usedSuperCoins;
    await order.save();

    // 💳 Razorpay Payment Link Creation
    const paymentLinkRequest = {
      amount: finalAmount * 100, // Razorpay expects amount in paisa
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
      // callback_url: `https://fluteon.com/payment/${orderId}`,
      callback_url: `http://localhost:3001/payment/${orderId}`,
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

// by gpt
const updatePaymentInformation = async (reqData) => {
  const paymentId = reqData.payment_id;
  const orderId = reqData.order_id;

  try {
    const order = await orderService.findOrderById(orderId);
    if (!order) throw new Error("Order not found");

    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status === "captured") {
      // ✅ Check if payment info already exists
      const existingPayment = await PaymentInformation.findOne({ order: order._id });
      if (existingPayment) {
        return {
          message: "Payment info already recorded",
          orderId: order._id,
          paymentId: existingPayment._id,
        };
      }

      // ✅ Deduct usedSuperCoins now
      const user = await User.findById(order.user);
      if (!user) throw new Error("User not found");

      if (order.usedSuperCoins && order.usedSuperCoins > 0) {
        if (user.superCoins < order.usedSuperCoins) {
          throw new Error("User doesn't have enough Super Coins to deduct");
        }

        user.superCoins -= order.usedSuperCoins;
        await user.save();
        console.log(`✅ Deducted ${order.usedSuperCoins} Super Coins from user ${user._id}`);
      }

      // ✅ Save payment info
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

      user.paymentInformation.push(paymentInfo._id);
      await user.save();

      // ✅ Update order status with payment details
      await orderService.placedOrder(orderId, {
        paymentId,
        method: payment.method,
        transactionId: payment.acquirer_data?.bank_transaction_id || "",
      });

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