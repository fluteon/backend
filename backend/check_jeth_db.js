require("dotenv").config();
const { connectDb } = require("./src/config/db");
const User = require("./src/models/user.model.js");

async function check() {
  await connectDb();
  const dbUser = await User.collection.findOne({ email: "gb3454304@gmail.com" });
  console.log("Jethalal RAW DB fonCoins:", dbUser.fonCoins);
  console.log("Jethalal RAW DB superCoins:", dbUser.superCoins);
  process.exit(0);
}
check();
