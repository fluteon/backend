require("dotenv").config();
const { connectDb } = require("./src/config/db");
const User = require("./src/models/user.model.js");
const Order = require("./src/models/order.model.js");
const fs = require('fs');

async function run() {
  await connectDb();
  
  const user = await User.findOne({ email: "gb3454304@gmail.com" });
  if (!user) {
    fs.writeFileSync('jethalal_json.txt', "User not found");
    return process.exit(0);
  }

  const latestOrder = await Order.findOne({ user: user._id }).sort({ createdAt: -1 });
  if (latestOrder) {
    const data = {
      orderId: latestOrder._id,
      status: latestOrder.orderStatus,
      earnedCoins: latestOrder.earnedSuperCoins,
      createdAt: latestOrder.createdAt,
      statusUpdatedAt: latestOrder.statusUpdatedAt
    };
    fs.writeFileSync('jethalal_json.txt', JSON.stringify(data, null, 2));
  } else {
    fs.writeFileSync('jethalal_json.txt', "No orders found");
  }
  
  process.exit(0);
}

run();
