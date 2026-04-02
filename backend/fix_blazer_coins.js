require("dotenv").config();
const { connectDb } = require("./src/config/db");
const Order = require("./src/models/order.model.js");
const User = require("./src/models/user.model.js");

async function run() {
  await connectDb();
  
  const user = await User.findOne({ email: "gb3454304@gmail.com" });
  if (user) {
    // Current is 1023 (since it added 28 instead of 2895 from previous 995).
    // Final correct amount should be 995 + 2895 = 3890.
    user.fonCoins = 3890;
    await user.save();
    console.log("Updated Jethalal fonCoins to 3890");
  }

  const latestOrder = await Order.findOne({ user: user._id }).sort({ createdAt: -1 });
  if (latestOrder && latestOrder.earnedSuperCoins === 28) {
    latestOrder.earnedSuperCoins = 2895;
    await latestOrder.save();
    console.log("Updated order earnedSuperCoins to 2895");
  }
  
  process.exit(0);
}

run();
