require("dotenv").config();
const { connectDb } = require("./src/config/db");
const User = require("./src/models/user.model.js");

async function check() {
  await connectDb();
  const dbUser = await User.collection.findOne({ email: "aryesh.shivmare34@gmail.com" });
  console.log("RAW DB fonCoins:", dbUser.fonCoins);
  console.log("RAW DB superCoins (should be undefined):", dbUser.superCoins);
  process.exit(0);
}
check();
