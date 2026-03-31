const { connectDb } = require("./src/config/db");
const mongoose = require("mongoose");
const User = require("./src/models/user.model.js");
const fs = require("fs");

async function check() {
  await connectDb();
  let logStr = "";
  const dbUser = await User.collection.findOne({ email: "aryesh.shivmare34@gmail.com" });
  logStr += "DB USER RAW:\n";
  logStr += JSON.stringify(dbUser, null, 2) + "\n";

  const Order = require("./src/models/order.model.js");
  const orders = await Order.find({ user: dbUser._id }).sort({ createdAt: -1 }).limit(3);
  logStr += "RECENT ORDERS:\n";
  orders.forEach(o => {
    logStr += `Order ${o._id}: status=${o.orderStatus}, totalDiscPrice=${o.totalDiscountedPrice}, earnedCoins=${o.earnedSuperCoins}\n`;
  });
  
  fs.writeFileSync("output.txt", logStr);
  process.exit(0);
}
check();
