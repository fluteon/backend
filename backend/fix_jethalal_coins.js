require("dotenv").config();
const { connectDb } = require("./src/config/db");
const User = require("./src/models/user.model.js");
const Order = require("./src/models/order.model.js");

async function run() {
  await connectDb();
  
  // Update Jethalal Mehta
  const user = await User.findOne({ email: "gb3454304@gmail.com" });
  if (user) {
    user.fonCoins = 995; // Manually fix their test account
    await user.save();
    console.log("Updated Jethalal fonCoins to 995");
  }

  // Update the latest order to reflect 995
  const latestOrder = await Order.findOne({ user: user._id }).sort({ createdAt: -1 });
  if (latestOrder && latestOrder.earnedSuperCoins === 9) {
    latestOrder.earnedSuperCoins = 995;
    await latestOrder.save();
    console.log("Updated order earnedSuperCoins to 995");
  }
  
  process.exit(0);
}

run();
