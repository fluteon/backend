const razorpay = require("../config/razorpayClient");
const PaymentInformation = require("../models/payment.information.js");
const User = require("../models/user.model.js");
const orderService = require("../services/order.service.js");
const mongoose = require("mongoose")



const createPaymentLink = async (orderId, usedSuperCoins = 0, couponDiscount = 0) => {
  try {
    const order = await orderService.findOrderById(orderId);
    if (!order) throw new Error("Order not found");

    const existingPayment = await PaymentInformation.findOne({ order: order._id });
    if (existingPayment) throw new Error("Payment already exists for this order");

    // 🔢 Calculate final amount
    const basePrice = order.totalDiscountedPrice || 0;
    const finalAmount = Math.max(basePrice - (usedSuperCoins * 1) - couponDiscount, 0);

    order.usedSuperCoins = usedSuperCoins;
    order.couponDiscount = couponDiscount;
    await order.save();

    // 👤 Determine customer info (user or guest)
    let customerName, customerContact, customerEmail;
    if (order.isGuestOrder || !order.user) {
      customerName = order.guestInfo?.name || "Guest";
      customerContact = order.guestInfo?.phone || "";
      customerEmail = order.guestInfo?.email || "";
    } else {
      const user = await User.findById(order.user);
      if (!user) throw new Error("User not found for this order");
      customerName = user.firstName + " " + user.lastName;
      customerContact = user.mobile || "";
      customerEmail = user.email;
    }

    const paymentLinkRequest = {
      amount: finalAmount * 100,
      currency: "INR",
      customer: { name: customerName, contact: customerContact, email: customerEmail },
      notify: { sms: !!customerContact, email: !!customerEmail },
      reminder_enable: true,
      callback_url: `http://fluteon.com/payment/${orderId}`,
      callback_method: "get",
    };

    console.log("🔗 Razorpay Payment Link Request:", paymentLinkRequest);
    const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);
    console.log("✅ Razorpay Payment Link Created:", paymentLink.short_url);

    return { paymentLinkId: paymentLink.id, payment_link_url: paymentLink.short_url };
  } catch (error) {
    console.error("❌ Error creating payment link:", error.message);
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
      const existingPayment = await PaymentInformation.findOne({ order: order._id });
      if (existingPayment) {
        return { message: "Payment info already recorded", orderId: order._id, paymentId: existingPayment._id };
      }

      // 👤 Handle guest vs registered user
      let userSnapshot;
      if (order.isGuestOrder || !order.user) {
        // Guest order — no super coins, simple snapshot
        userSnapshot = {
          firstName: order.guestInfo?.name || "Guest",
          lastName: "",
          email: order.guestInfo?.email || "",
          mobile: order.guestInfo?.phone || "",
        };
      } else {
        const user = await User.findById(order.user);
        if (!user) throw new Error("User not found");

        // Deduct super coins for registered users
        if (order.usedSuperCoins && order.usedSuperCoins > 0) {
          if (user.superCoins < order.usedSuperCoins) throw new Error("Not enough Super Coins");
          user.superCoins -= order.usedSuperCoins;
          await user.save();
          console.log(`✅ Deducted ${order.usedSuperCoins} Super Coins from user ${user._id}`);
        }

        userSnapshot = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
        };
      }

      const paymentInfo = new PaymentInformation({
        user: order.user || null,
        userSnapshot,
        order: order._id,
        paymentId,
        status: "COMPLETED",
        amount: payment.amount / 100,
        paidAt: new Date(),
      });

      await paymentInfo.save();

      // Only push to user.paymentInformation for registered users
      if (order.user) {
        const user = await User.findById(order.user);
        if (user) {
          user.paymentInformation.push(paymentInfo._id);
          await user.save();
        }
      }

      await orderService.placedOrder(orderId, {
        paymentId,
        method: payment.method,
        transactionId: payment.acquirer_data?.bank_transaction_id || "",
      });

      return { message: "Order placed & payment recorded", orderId: order._id, paymentId: paymentInfo._id };
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

const createCODOrder = async (orderId, usedSuperCoins = 0, couponDiscount = 0) => {
  try {
    const order = await orderService.findOrderById(orderId);
    if (!order) throw new Error("Order not found");

    const existingPayment = await PaymentInformation.findOne({ order: order._id });
    if (existingPayment) throw new Error("Payment already exists for this order");

    const basePrice = order.totalDiscountedPrice || 0;
    const finalAmount = Math.max(basePrice - (usedSuperCoins * 1) - couponDiscount, 0);

    order.usedSuperCoins = usedSuperCoins;
    order.couponDiscount = couponDiscount;
    await order.save();

    // 👤 Handle guest vs registered user
    let userSnapshot;
    let userId = null;
    if (order.isGuestOrder || !order.user) {
      userSnapshot = {
        firstName: order.guestInfo?.name || "Guest",
        lastName: "",
        email: order.guestInfo?.email || "",
        mobile: order.guestInfo?.phone || "",
      };
    } else {
      const user = await User.findById(order.user);
      if (!user) throw new Error("User not found for this order");
      userId = user._id;

      if (usedSuperCoins > 0) {
        if (user.superCoins < usedSuperCoins) throw new Error("Not enough Super Coins");
        user.superCoins -= usedSuperCoins;
        await user.save();
      }

      userSnapshot = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
      };
    }

    const paymentInfo = new PaymentInformation({
      user: userId,
      userSnapshot,
      order: order._id,
      paymentId: `COD_${order._id}_${Date.now()}`,
      status: "PENDING",
      amount: finalAmount,
      paidAt: new Date(),
    });

    await paymentInfo.save();

    if (userId) {
      const user = await User.findById(userId);
      if (user) { user.paymentInformation.push(paymentInfo._id); await user.save(); }
    }

    await orderService.placedOrder(orderId, {
      paymentId: paymentInfo.paymentId,
      method: "COD",
      transactionId: `COD_${order._id}`,
    });

    console.log("✅ COD Order placed successfully");
    return { message: "COD Order placed successfully", orderId: order._id, paymentMethod: "COD", amount: finalAmount };
  } catch (error) {
    console.error("❌ Error creating COD order:", error.message);
    throw new Error(error.message);
  }
};

module.exports = { createPaymentLink, updatePaymentInformation, getUserPaymentHistory, createCODOrder, }