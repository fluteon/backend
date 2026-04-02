require("dotenv").config();
const { connectDb } = require("./src/config/db");
const User = require("./src/models/user.model.js");
const Order = require("./src/models/order.model.js");
const fs = require('fs');

async function run() {
  await connectDb();
  
  const user = await User.findOne({ email: "gb3454304@gmail.com" });
  const latestOrder = await Order.findOne({ user: user._id }).sort({ createdAt: -1 });
  
  fs.writeFileSync('jethalal_full.txt', JSON.stringify(latestOrder, null, 2));
  process.exit(0);
}

run();
