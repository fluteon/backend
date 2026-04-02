require("dotenv").config();
const { connectDb } = require("./src/config/db");
const Order = require("./src/models/order.model.js");
const User = require("./src/models/user.model.js");
const fs = require('fs');

async function run() {
  await connectDb();
  
  const user = await User.findOne({ email: "gb3454304@gmail.com" });
  const latestOrder = await Order.findOne({ user: user._id }).sort({ createdAt: -1 });
  
  if (latestOrder) {
    const data = {
      orderId: latestOrder._id,
      status: latestOrder.orderStatus,
      totalPrice: latestOrder.totalPrice,
      totalDiscountedPrice: latestOrder.totalDiscountedPrice,
      earnedCoins: latestOrder.earnedSuperCoins,
      usedCoins: latestOrder.usedSuperCoins,
      couponDiscount: latestOrder.couponDiscount,
      createdAt: latestOrder.createdAt
    };
    fs.writeFileSync('blazer_dump.txt', JSON.stringify(data, null, 2));
  }
  
  process.exit(0);
}

run();
