require("dotenv").config();
const { connectDb } = require("./src/config/db");
const User = require("./src/models/user.model.js");
const Order = require("./src/models/order.model.js");

async function run() {
  await connectDb();
  
  const user = await User.findOne({ email: "gb3454304@gmail.com" });
  if (!user) {
    console.log("Jethalal not found");
    return process.exit(0);
  }

  const latestOrder = await Order.findOne({ user: user._id }).sort({ createdAt: -1 });
  if (latestOrder) {
    console.log(`Latest Order ID: ${latestOrder._id}`);
    console.log(`Order Status: ${latestOrder.orderStatus}`);
    console.log(`Earned Coins: ${latestOrder.earnedSuperCoins}`);
    console.log(`Created At: ${latestOrder.createdAt}`);
    console.log(`Status Updated At: ${latestOrder.statusUpdatedAt}`);
  } else {
    console.log("No orders found");
  }
  
  process.exit(0);
}

run();
