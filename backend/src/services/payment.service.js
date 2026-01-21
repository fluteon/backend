const razorpay = require("../config/razorpayClient");
const PaymentInformation = require("../models/payment.information.js");
const User = require("../models/user.model.js");
const orderService=require("../services/order.service.js");
const mongoose = require("mongoose")



const createPaymentLink = async (orderId, usedSuperCoins = 0, couponDiscount = 0) => {
  try {
    const order = await orderService.findOrderById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const existingPayment = await PaymentInformation.findOne({ order: order._id });
    if (existingPayment) {
      throw new Error("Payment already exists for this order");
    }

    const user = await User.findById(order.user);
    if (!user) {
      throw new Error("User not found for this order");
    }

    // 🔢 Calculate final amount
    const discountFromCoins = usedSuperCoins * 1;
    const basePrice = order.totalDiscountedPrice || 0;
    const finalAmount = Math.max(basePrice - discountFromCoins - couponDiscount, 0);

    // 🪵 Debug logs
    console.log("🧾 Order Summary:");
    console.log("Base Price:", basePrice);
    console.log("Used Super Coins:", usedSuperCoins, "→ ₹", discountFromCoins);
    console.log("Coupon Discount:", couponDiscount);
    console.log("➡️ Final Payable Amount:", finalAmount);

    // 💾 Save to order
    order.usedSuperCoins = usedSuperCoins;
    order.couponDiscount = couponDiscount;
    await order.save();

    const paymentLinkRequest = {
      amount: finalAmount * 100, // Razorpay expects in paisa
      currency: "INR",
      customer: {
        name: user.firstName + " " + user.lastName,
        contact: user.mobile,
        email: user.email,
      },
      notify: { sms: true, email: true },
      reminder_enable: true,
      // callback_url: `http://localhost:3001/payment/${orderId}`, // 🛑 Replace with prod before launch
      callback_url: `http://fluteon.com/payment/${orderId}`, 
      callback_method: "get",
    };

    // 🪵 Razorpay Request Preview
    console.log("🔗 Razorpay Payment Link Request:", paymentLinkRequest);

    const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);

    console.log("✅ Razorpay Payment Link Created:", paymentLink.short_url);

    return {
      paymentLinkId: paymentLink.id,
      payment_link_url: paymentLink.short_url,
    };
  } catch (error) {
    console.error("❌ Error creating payment link:", error.message);
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

// ✅ New function for Cash on Delivery
const createCODOrder = async (orderId, usedSuperCoins = 0, couponDiscount = 0) => {
  try {
    const order = await orderService.findOrderById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const existingPayment = await PaymentInformation.findOne({ order: order._id });
    if (existingPayment) {
      throw new Error("Payment already exists for this order");
    }

    const user = await User.findById(order.user);
    if (!user) {
      throw new Error("User not found for this order");
    }

    // 🔢 Calculate final amount
    const discountFromCoins = usedSuperCoins * 1;
    const basePrice = order.totalDiscountedPrice || 0;
    const finalAmount = Math.max(basePrice - discountFromCoins - couponDiscount, 0);

    console.log("🧾 COD Order Summary:");
    console.log("Base Price:", basePrice);
    console.log("Used Super Coins:", usedSuperCoins, "→ ₹", discountFromCoins);
    console.log("Coupon Discount:", couponDiscount);
    console.log("➡️ Final COD Amount:", finalAmount);

    // 💾 Save to order
    order.usedSuperCoins = usedSuperCoins;
    order.couponDiscount = couponDiscount;
    await order.save();

    // ✅ Deduct usedSuperCoins now
    if (usedSuperCoins && usedSuperCoins > 0) {
      if (user.superCoins < usedSuperCoins) {
        throw new Error("User doesn't have enough Super Coins to deduct");
      }
      user.superCoins -= usedSuperCoins;
      await user.save();
      console.log(`✅ Deducted ${usedSuperCoins} Super Coins from user ${user._id}`);
    }

    // ✅ Create payment info for COD
    const paymentInfo = new PaymentInformation({
      user: user._id,
      userSnapshot: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
      },
      order: order._id,
      paymentId: `COD_${order._id}_${Date.now()}`,
      status: "PENDING", // COD is pending until delivery
      amount: finalAmount,
      paidAt: new Date(),
    });

    await paymentInfo.save();
    user.paymentInformation.push(paymentInfo._id);
    await user.save();

    // ✅ Update order status with COD payment details
    await orderService.placedOrder(orderId, {
      paymentId: paymentInfo.paymentId,
      method: "COD",
      transactionId: `COD_${order._id}`,
    });

    console.log("✅ COD Order placed successfully");

    return {
      message: "COD Order placed successfully",
      orderId: order._id,
      paymentMethod: "COD",
      amount: finalAmount,
    };
  } catch (error) {
    console.error("❌ Error creating COD order:", error.message);
    throw new Error(error.message);
  }
};

module.exports={createPaymentLink,updatePaymentInformation,getUserPaymentHistory,createCODOrder,}