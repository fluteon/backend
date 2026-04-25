const Address = require("../models/address.model.js");
const Order = require("../models/order.model.js");
const OrderItem = require("../models/orderItems.js");
const Product = require("../models/product.model.js");
const User = require("../models/user.model.js");
const cartService = require("../services/cart.service.js");
const CartItem = require("../models/cartItem.model.js");
const mongoose = require("mongoose");
const { sendOrderConfirmationEmail } = require("../config/mailer.js");
const { notifyOwnerNewOrder } = require("../services/ownerNotification.service.js");
const Coupon = require("../models/coupon.model.js");
const CouponUsage = require("../models/coupon.usage.model.js");

// async function createOrder(user, shippAddress, usedSuperCoins = 0) {
//   let address;

//   if (shippAddress._id) {
//     address = await Address.findById(shippAddress._id);
//   } else {
//     address = new Address(shippAddress);
//     address.user = user;
//     await address.save();
//     user.addresses.push(address);
//     await user.save();
//   }

//   const cart = await cartService.findUserCart(user._id);
//   const orderItems = [];
//   const orderedProductIds = [];

//   for (const item of cart.cartItems) {
//     const orderItem = new OrderItem({
//       price: item.price,
//       product: item.product,
//       quantity: item.quantity,
//       size: item.size,
//       userId: item.userId,
//       discountedPrice: item.discountedPrice,
//     });

//     const createdOrderItem = await orderItem.save();
//     orderItems.push(createdOrderItem);
//     orderedProductIds.push(item.product._id.toString());
//   }

//   // 🪙 Validate and Deduct Super Coins
// const dbUser = await User.findById(user._id); // ✅ Fetch Mongoose document
// if (!dbUser) throw new Error("User not found");

// if (usedSuperCoins > 0) {
//   if (dbUser.superCoins < usedSuperCoins) {
//     throw new Error("Insufficient Super Coins");
//   }

//   dbUser.superCoins -= usedSuperCoins; // ✅ Deduct coins from Mongoose doc
//   await dbUser.save(); // ✅ Save it properly
// }
//   const discountFromCoins = usedSuperCoins * 1;
//   const finalPriceAfterCoins = Math.max(cart.totalDiscountedPrice - discountFromCoins, 0);

//   const createdOrder = new Order({
//     user,
//     orderItems,
//     totalPrice: cart.totalPrice,
//     totalDiscountedPrice: finalPriceAfterCoins,
//     discounte: cart.discounte,
//     totalItem: cart.totalItem,
//     shippingAddress: address,
//     usedSuperCoins,
//     orderDate: new Date(),
//     orderStatus: "PENDING",
//     paymentDetails: { paymentStatus: "PENDING" },
//     createdAt: new Date(),
//   });

//   return await createdOrder.save();
// }

async function createOrder(user, shippAddress, usedSuperCoins = 0) {
  let address;

  // 🏠 Address setup
  if (shippAddress._id) {
    address = await Address.findById(shippAddress._id);
  } else {
    address = new Address(shippAddress);
    address.user = user;
    await address.save();
    user.addresses.push(address);
    await user.save();
  }

  // 🛒 Get cart & items
  const cart = await cartService.findUserCart(user._id);
  const orderItems = [];

  for (const item of cart.cartItems) {
    const orderItem = new OrderItem({
      price: item.price,
      product: item.product,
      quantity: item.quantity,
      size: item.size,
      userId: item.userId,
      discountedPrice: item.discountedPrice,
    });
    const createdOrderItem = await orderItem.save();
    orderItems.push(createdOrderItem);
  }

  // 🪙 Super Coin Handling
  const dbUser = await User.findById(user._id);
  if (!dbUser) throw new Error("User not found");

  if (usedSuperCoins > 0) {
    const currentCoins = dbUser.fonCoins || 0;
    if (currentCoins < usedSuperCoins) {
      throw new Error("Insufficient Super Coins");
    }
    dbUser.fonCoins = currentCoins - usedSuperCoins;
    await dbUser.save();
  }

  const discountFromCoins = usedSuperCoins / 100;

  // 🎟️ Coupon Handling
  const couponCode = cart?.couponCode || null;
  const couponDiscount = cart?.couponDiscount || 0;

  // Check coupon limit before placing order
  if (couponCode) {
    const couponObj = await Coupon.findOne({ code: couponCode, isActive: true });
    if (!couponObj) {
        throw new Error("Coupon is no longer valid or active.");
    }
    if (couponObj.usageLimit && (couponObj.usedBy?.length || 0) >= couponObj.usageLimit) {
        throw new Error("Coupon usage limit reached during checkout.");
    }
  }

  // 💰 Final price after all discounts
  const finalPriceAfterCoinsAndCoupon = Math.max(
    cart.totalDiscountedPrice - discountFromCoins - couponDiscount,
    0
  );

  // 📦 Create order
  const createdOrder = new Order({
    user,
    orderItems,
    totalPrice: cart.totalPrice,
    totalDiscountedPrice: finalPriceAfterCoinsAndCoupon,
    discounte: cart.discounte,
    totalItem: cart.totalItem,
    shippingAddress: address,
    usedSuperCoins,
    couponCode,
    couponDiscount,
    orderDate: new Date(),
    orderStatus: "PENDING",
    paymentDetails: { paymentStatus: "PENDING" },
    createdAt: new Date(),
  });

  // ✅ Clear coupon from cart after order creation to prevent auto-application on next order
  cart.couponCode = null;
  cart.couponDiscount = 0;
  await cart.save();

  const savedOrder = await createdOrder.save();

  if (couponCode) {
    const couponObj = await Coupon.findOne({ code: couponCode });
    if (couponObj) {
      couponObj.usedBy.push(user._id);
      await couponObj.save();

      const usage = new CouponUsage({
        code: couponObj.code,
        user: user._id,
        order: savedOrder._id,
        discountAmount: couponDiscount,
      });
      await usage.save();
    }
  }

  return savedOrder;
}



async function placedOrder(orderId, paymentMeta = {}) {
  const order = await findOrderById(orderId);
  if (!order) throw new Error("Order not found");

  if (paymentMeta.paymentId) order.paymentDetails.paymentId = paymentMeta.paymentId;
  if (paymentMeta.method) order.paymentDetails.paymentMethod = paymentMeta.method;
  if (paymentMeta.transactionId) order.paymentDetails.transactionId = paymentMeta.transactionId;

  order.paymentDetails.paymentStatus = "COMPLETED";
  order.statusUpdatedAt = new Date();
  order.orderStatus = "CONFIRMED";

  const updatedOrder = await order.save();

  // Only clean cart for registered users (guests have no cart)
  if (order.user && order.user._id) {
    const productIds = order.orderItems.map((item) => item.product._id);
    await CartItem.deleteMany({
      userId: order.user._id,
      product: { $in: productIds },
    });
  }

  // Send confirmation email if available
  const emailAddress = order.isGuestOrder
    ? order.guestInfo?.email
    : updatedOrder?.user?.email;
  if (emailAddress) {
    try {
      await sendOrderConfirmationEmail(emailAddress, updatedOrder);
    } catch (e) {
      console.error("Email send failed:", e.message);
    }
  }

  // Send WhatsApp to customer if available
  const phone = order.isGuestOrder ? order.guestInfo?.phone : updatedOrder?.shippingAddress?.mobile;
  if (phone) {
    const phone10 = phone.replace(/^\+?91/, "").trim();
    if (phone10.length === 10) {
      const { sendWhatsAppOrderConfirmation } = require("../services/whatsapp.service.js");
      const frontendUrl = process.env.FRONTEND_URL || "https://www.fluteon.com";
      const trackUrl = `${frontendUrl}/track-order?id=${updatedOrder._id}`;
      const notifInfo = {
          name: order.isGuestOrder ? order.guestInfo?.name : (updatedOrder?.shippingAddress?.firstName + " " + updatedOrder?.shippingAddress?.lastName),
          orderId: String(updatedOrder._id),
          amount: updatedOrder.totalDiscountedPrice,
          trackUrl,
          items: updatedOrder.orderItems || [],
          shippingAddress: updatedOrder.shippingAddress || {},
      };
      sendWhatsAppOrderConfirmation(phone10, notifInfo).catch(e => 
          console.error("Customer WhatsApp alert failed:", e.message)
      );
    }
  }

  // Notify owner via WhatsApp (non-blocking)
  notifyOwnerNewOrder(updatedOrder).catch((e) =>
    console.error("Owner order alert failed:", e.message)
  );

  return updatedOrder;
}


async function confirmedOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "CONFIRMED";
  order.statusUpdatedAt = new Date();
  return await order.save();
}

async function shipOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "SHIPPED";
  order.statusUpdatedAt = new Date();
  return await order.save();
}

async function outForDelivery(orderId) {
  const order = await findOrderById(orderId);

  if (!order) {
    throw new Error("Order not found with ID: " + orderId);
  }

  order.orderStatus = "OUTFORDELIVERY";
  order.statusUpdatedAt = new Date();
  return await order.save();
}

async function deliveredOrder(orderId) {
  const order = await findOrderById(orderId);
  if (!order) throw new Error("Order not found");

  order.orderStatus = "DELIVERED";
  order.statusUpdatedAt = new Date();

  await order.save();

  // ✅ Reward Super Coins — only for registered users
  if (!order.isGuestOrder && order.user?._id) {
    console.log("🎯 Rewarding superCoins to:", order.user?._id, order.user?.email);
    try {
      await rewardeSuperCoins(order.user._id, order._id);
    } catch (error) {
      console.error("⚠️ Failed to reward Super Coins:", error.message);
    }
  }

  const lowStockAlerts = [];

  for (const item of order.orderItems) {
    const product = await Product.findById(item.product._id);
    if (!product) continue;

    const sizeToUpdate = product.sizes.find(s => s.name === item.size);
    if (sizeToUpdate) {
      sizeToUpdate.quantity -= item.quantity;
      if (sizeToUpdate.quantity < 0) sizeToUpdate.quantity = 0;

      if (sizeToUpdate.quantity < 2) {
        lowStockAlerts.push({
          productId: product._id,
          title: product.title,
          size: sizeToUpdate.name,
          remaining: sizeToUpdate.quantity,
        });
      }
    }

    await product.save();
  }

  return {
    message: "Order marked as delivered and super coins rewarded",
    lowStockAlerts,
  };
}


async function cancelledOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "CANCELLED";
  order.statusUpdatedAt = new Date();
  return await order.save();
}


async function returnOrder(orderId, reason = "", description = "", imageUrls = []) {
  const order = await findOrderById(orderId);
  if (!order) throw new Error("Order not found with ID: " + orderId);

  if (order.orderStatus !== "DELIVERED") {
    throw new Error("Only delivered orders can be returned.");
  }

  order.orderStatus = "RETURNED_REQUESTED";
  order.statusUpdatedAt = new Date();
  order.returnRequestedAt = new Date();

  if (reason) order.returnReason = reason;
  if (description) order.returnDescription = description;
  if (imageUrls.length > 0) order.returnImages = imageUrls;

  const updatedOrder = await order.save();
  return updatedOrder;
}


async function approveReturnByAdmin(orderId, status, adminNote, rejectionMessage, returnTime) {
  const order = await findOrderById(orderId);
  if (!order) throw new Error("Order not Found with Id : " + orderId);

  if (order.orderStatus !== "RETURNED_REQUESTED") {
    throw new Error("Only requested returns can be handled.");
  }

  if (status === "RETURN_APPROVED") {
    order.orderStatus = "RETURNED";
    order.returnApprovedAt = new Date();
    order.returnTime = returnTime;

    // 🪙 Deduct earned SuperCoins when return is approved — only for registered users
    if (!order.isGuestOrder && order.user?._id && order.earnedSuperCoins > 0) {
      console.log("🔄 Deducting", order.earnedSuperCoins, "SuperCoins from user", order.user._id);

      const user = await User.findById(order.user._id);
      if (user) {
        const currentCoins = user.fonCoins || 0;
        user.fonCoins = Math.max(0, currentCoins - order.earnedSuperCoins);
        await user.save();
        console.log("✅ SuperCoins deducted. New balance:", user.fonCoins);
      }
    }

    // 💰 Refund used SuperCoins if customer used coins for this order — only for registered users
    if (!order.isGuestOrder && order.user?._id && order.usedSuperCoins > 0) {
      console.log("💰 Refunding", order.usedSuperCoins, "SuperCoins to user", order.user._id);

      const user = await User.findById(order.user._id);
      if (user) {
        user.fonCoins = (user.fonCoins || 0) + order.usedSuperCoins;
        await user.save();
        console.log("✅ SuperCoins refunded. New balance:", user.fonCoins);
      }
    }

  } else if (status === "RETURN_REJECTED") {
    order.orderStatus = "RETURN_REJECTED";
    order.returnRejectedAt = new Date();
    order.rejectionMessage = rejectionMessage || ""; // ✅ Save it here
  } else {
    throw new Error("Invalid return status.");
  }


  order.statusUpdatedAt = new Date();

  // 👇 Save this field
  order.adminNote = adminNote;
  order.statusUpdatedAt = new Date();

  const updatedOrder = await order.save();
  return updatedOrder;
}




async function findOrderById(orderId) {
  console.log("🔍 [findOrderById] Searching for Order with ID:", orderId);

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    console.log("❌ Invalid orderId format:", orderId);
    return null;
  }

  try {
    const order = await Order.findById(orderId)
      .populate("user")
      .populate({ path: "orderItems", populate: { path: "product" } })
      .populate("shippingAddress");

    if (!order) {
      console.log("❌ No order found for ID:", orderId);
    } else {
      console.log("✅ Order found:", order._id);
    }

    return order;
  } catch (error) {
    console.error("🔥 Error in findOrderById:", error.message);
    throw error;
  }
}

const usersOrderHistory = async (userId) => {
  const orders = await Order.find({
    user: userId,
    "paymentDetails.paymentStatus": "COMPLETED"
  })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
      },
    })
    .sort({ createdAt: -1 })
    .lean();

  return orders;
};

async function getAllOrders(page = 1, pageSize = 10, status = "", sort = "Newest") {
  const skip = (page - 1) * pageSize;

  const filter = {
    orderStatus: { $ne: "PENDING" },
  };
  if (status) filter.orderStatus = status;

  const sortOption = sort === "Oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const query = Order.find(filter)
    .populate("user")
    .populate("shippingAddress")
    .populate({
      path: "orderItems",
      populate: { path: "product" },
    })
    .sort(sortOption);

  const totalOrders = await Order.countDocuments(filter);
  const totalPages = Math.ceil(totalOrders / pageSize);

  const orders = await query.skip(skip).limit(pageSize).lean();

  return {
    content: orders,
    currentPage: page,
    totalPages,
    totalOrders,
  };
}
async function deleteOrder(orderId) {
  const order = await findOrderById(orderId);
  if (!order) throw new Error("order not found with id " + orderId);

  await Order.findByIdAndDelete(orderId);
}


async function getAdminDashboardOverview() {
  const customerCount = await User.countDocuments();
  const productCount = await Product.countDocuments();
  const recentUsers = await User
    .find({})
    .sort({ createdAt: -1 }) // Most recent first
    .limit(5)
    .select("firstName lastName email createdAt"); // Select only required fields


  const recentOrders = await Order.find({ orderStatus: { $ne: "PENDING" } })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("orderItems.product", "title imageUrl brand") // adjust fields based on your schema
    .select("totalDiscountedPrice orderStatus orderId orderItems createdAt"); // optional: pick fields

  const totalRevenueAgg = await Order.aggregate([
    { $match: { "paymentDetails.paymentStatus": "COMPLETED" } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalDiscountedPrice" },
        totalOrders: { $sum: 1 },
        totalProfit: { $sum: { $subtract: ["$totalDiscountedPrice", "$discounte"] } },
      },
    },
  ]);

  const revenueData = totalRevenueAgg[0] || {
    totalRevenue: 0,
    totalOrders: 0,
    totalProfit: 0,
  };

  const refundCount = await Order.countDocuments({
    orderStatus: "CANCELLED",
  });

  const recentWeekOrders = await Order.find({
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    "paymentDetails.paymentStatus": "COMPLETED",
  });

  // ========== 📊 Weekly Sales ==========
  const weeklySalesRaw = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        "paymentDetails.paymentStatus": "COMPLETED",
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        total: { $sum: "$totalDiscountedPrice" },
      },
    },
    { $sort: { _id: 1 } }
  ]);

  const weeklySales = Array(7).fill(0);
  weeklySalesRaw.forEach(day => {
    const index = day._id - 1; // MongoDB: 1=Sunday ... 7=Saturday
    weeklySales[index] = day.total;
  });

  // ========== 📆 Monthly Sales (last 30 days split by week) ==========
  const monthlySalesRaw = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        "paymentDetails.paymentStatus": "COMPLETED",
      },
    },
    {
      $group: {
        _id: { $week: "$createdAt" },
        total: { $sum: "$totalDiscountedPrice" },
      },
    },
    { $sort: { _id: 1 } }
  ]);

  const monthlySales = monthlySalesRaw.map(entry => entry.total);

  // ========== 📅 Yearly Sales (by month) ==========
  const yearlySalesRaw = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) },
        "paymentDetails.paymentStatus": "COMPLETED",
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        total: { $sum: "$totalDiscountedPrice" },
      },
    },
    { $sort: { _id: 1 } }
  ]);

  const yearlySales = Array(12).fill(0);
  yearlySalesRaw.forEach(month => {
    yearlySales[month._id - 1] = month.total;
  });

  return {
    totalRevenue: revenueData.totalRevenue,
    totalProfit: revenueData.totalProfit,
    totalOrders: revenueData.totalOrders,
    refundCount,
    productCount,
    customerCount,
    newOrdersLast7Days: recentWeekOrders.length,
    weeklySales,
    monthlySales,
    yearlySales,
    recentUsers,
    recentOrders,
  };
}


const rewardeSuperCoins = async (userId, orderId) => {
  console.log("🎯 rewardeSuperCoins called for", userId, "with order", orderId);

  const order = await Order.findById(orderId);
  if (!order || order.orderStatus !== "DELIVERED") {
    console.log("❌ Order not delivered or not found");
    throw new Error("Coins can only be rewarded after delivery");
  }

  const coins = Math.floor(order.totalDiscountedPrice);
  console.log("🪙 Coins to be rewarded:", coins);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $inc: { fonCoins: coins } },
    { new: true }
  );

  if (!updatedUser) {
    console.log("❌ User not found for reward");
  } else {
    console.log("✅ Super coins added. New Balance:", updatedUser.fonCoins);
  }

  order.earnedSuperCoins = coins;
  await order.save();

  return updatedUser;
};
const applySuperCoins = async (userId, coinCount, orderAmount) => {
  const user = await User.findById(userId);
  if (coinCount > (user.fonCoins || 0)) throw new Error("Not enough coins");

  const discount = coinCount / 100; // ₹1 for every 100 coins
  const finalAmount = Math.max(orderAmount - discount, 0);

  return { finalAmount, discount };
};


module.exports = {
  createOrder,
  placedOrder,
  confirmedOrder,
  shipOrder,
  deliveredOrder,
  cancelledOrder,
  findOrderById,
  usersOrderHistory,
  getAllOrders,
  deleteOrder,
  outForDelivery,
  returnOrder,
  approveReturnByAdmin,
  getAdminDashboardOverview,
  rewardeSuperCoins,
  applySuperCoins
};