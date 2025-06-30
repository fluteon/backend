// const Address = require("../models/address.model.js");
// const Order = require("../models/order.model.js");
// const OrderItem = require("../models/orderItems.js");
// const cartService = require("../services/cart.service.js");
// const mongoose = require("mongoose"); // Make sure it's imported at the top

// async function createOrder(user, shippAddress) {
//   let address;
//   if (shippAddress._id) {
//     let existedAddress = await Address.findById(shippAddress._id);
//     address = existedAddress;
//   } else {
//     address = new Address(shippAddress);
//     address.user = user;
//     await address.save();

//     user.addresses.push(address);
//     await user.save();
//   }

//   const cart = await cartService.findUserCart(user._id);
//   const orderItems = [];

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
//   }

//   const createdOrder = new Order({
//     user,
//     orderItems,
//     totalPrice: cart.totalPrice,
//     totalDiscountedPrice: cart.totalDiscountedPrice,
//     discounte: cart.discounte,
//     totalItem: cart.totalItem,
//     shippingAddress: address,
//     orderDate: new Date(),
//     orderStatus: "PENDING", // Assuming OrderStatus is a string enum or a valid string value
//     "paymentDetails.status": "PENDING", // Assuming PaymentStatus is nested under 'paymentDetails'
//     createdAt: new Date(),
//   });

//   const savedOrder = await createdOrder.save();

//   // for (const item of orderItems) {
//   //   item.order = savedOrder;
//   //   await item.save();
//   // }

//   return savedOrder;
// }

// async function placedOrder(orderId) {
//   const order = await findOrderById(orderId);
//   order.orderStatus = "PLACED";
//   order.paymentDetails.status = "COMPLETED";
//   return await order.save();
// }

// async function confirmedOrder(orderId) {
//   const order = await findOrderById(orderId);
//   order.orderStatus = "CONFIRMED";
//   return await order.save();
// }

// async function shipOrder(orderId) {
//   const order = await findOrderById(orderId);
//   order.orderStatus = "SHIPPED";
//   return await order.save();
// }

// async function deliveredOrder(orderId) {
//   const order = await findOrderById(orderId);
//   order.orderStatus = "DELIVERED";
//   return await order.save();
// }

// async function cancelledOrder(orderId) {
//   const order = await findOrderById(orderId);
//   order.orderStatus = "CANCELLED"; // Assuming OrderStatus is a string enum or a valid string value
//   return await order.save();
// }

// async function findOrderById(orderId) {
//   console.log("🔍 [findOrderById] Searching for Order with ID:", orderId);
  
//   if (!mongoose.Types.ObjectId.isValid(orderId)) {
//     console.log("❌ Invalid orderId format:", orderId);
//     return null;
//   }

//   try {
//     const order = await Order.findById(orderId)
//       .populate("user")
//       .populate({ path: "orderItems", populate: { path: "product" } })
//       .populate("shippingAddress");

//     if (!order) {
//       console.log("❌ No order found for ID:", orderId);
//     } else {
//       console.log("✅ Order found:", order._id);
//     }

//     return order;
//   } catch (error) {
//     console.error("🔥 Error in findOrderById:", error.message);
//     throw error;
//   }
// }


// async function usersOrderHistory(userId) {
//   try {
//     const orders = await Order.find({
//       user: userId,
//       orderStatus: "PLACED",
//     })
//       .populate({
//         path: "orderItems",
//         populate: {
//           path: "product",
//         },
//       })
//       .lean();


//     return orders;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

// async function getAllOrders() {
//   return await Order.find()
//     .populate("user") // Get full user details
//     .populate("shippingAddress") // Get full shipping address
//     .populate({
//       path: "orderItems",
//       populate: {
//         path: "product", // Get product inside each order item
//       },
//     })
//     .lean();
// }

// async function deleteOrder(orderId) {
//   const order = await findOrderById(orderId);
//   if(!order)throw new Error("order not found with id ",orderId)

//   await Order.findByIdAndDelete(orderId);
// }

// module.exports = {
//   createOrder,
//   placedOrder,
//   confirmedOrder,
//   shipOrder,
//   deliveredOrder,
//   cancelledOrder,
//   findOrderById,
//   usersOrderHistory,
//   getAllOrders,
//   deleteOrder,
// };


const Address = require("../models/address.model.js");
const Order = require("../models/order.model.js");
const OrderItem = require("../models/orderItems.js");
const cartService = require("../services/cart.service.js");
const mongoose = require("mongoose");
const { sendOrderConfirmationEmail } = require("../config/mailer.js");

async function createOrder(user, shippAddress) {
  let address;
  if (shippAddress._id) {
    let existedAddress = await Address.findById(shippAddress._id);
    address = existedAddress;
  } else {
    address = new Address(shippAddress);
    address.user = user;
    await address.save();

    user.addresses.push(address);
    await user.save();
  }

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

  const createdOrder = new Order({
    user,
    orderItems,
    totalPrice: cart.totalPrice,
    totalDiscountedPrice: cart.totalDiscountedPrice,
    discounte: cart.discounte,
    totalItem: cart.totalItem,
    shippingAddress: address,
    orderDate: new Date(),
    orderStatus: "PENDING",
    "paymentDetails.status": "PENDING",
    createdAt: new Date(),
  });

  const savedOrder = await createdOrder.save();

  return savedOrder;
}

async function placedOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "PLACED";
  order.paymentDetails.status = "COMPLETED";
  const updatedOrder = await order.save();

  // Send confirmation email after successful order placement and payment
  if (updatedOrder?.user?.email) {
    await sendOrderConfirmationEmail(updatedOrder.user.email, updatedOrder);
  }

  return updatedOrder;
}

async function confirmedOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "CONFIRMED";
  return await order.save();
}

async function shipOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "SHIPPED";
  return await order.save();
}

async function deliveredOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "DELIVERED";
  return await order.save();
}

async function cancelledOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "CANCELLED";
  return await order.save();
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

async function usersOrderHistory(userId) {
  try {
    const orders = await Order.find({
      user: userId,
      orderStatus: "PLACED",
    })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
        },
      })
      .lean();

    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAllOrders() {
  return await Order.find()
    .populate("user")
    .populate("shippingAddress")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
      },
    })
    .lean();
}

async function deleteOrder(orderId) {
  const order = await findOrderById(orderId);
  if (!order) throw new Error("order not found with id " + orderId);

  await Order.findByIdAndDelete(orderId);
}

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
};
