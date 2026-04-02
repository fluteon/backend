require("dotenv").config();
const { connectDb } = require("./src/config/db");
const { rewardeSuperCoins } = require("./src/services/order.service.js");

async function run() {
  await connectDb();
  try {
    // We already have jethalal order ID from earlier: 69ce22cebc269ca3547d6912.
    // Let's create a fake order to test it safely. 
    console.log(rewardeSuperCoins.toString());
  } catch(e) {
    console.error(e);
  }
  process.exit();
}
run();
