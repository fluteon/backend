const { connectDb } = require("./src/config/db");
const mongoose = require("mongoose");
const User = require("./src/models/user.model.js");
const fs = require("fs");

async function testInc() {
  await connectDb();
  let log = "";
  let user = await User.findOne({ email: "aryesh.shivmare34@gmail.com" });
  log += "BEFORE: " + user.fonCoins + "\n";
  
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { $inc: { fonCoins: 9 } },
    { new: true }
  );
  
  log += "AFTER UPDATE: " + updatedUser.fonCoins + "\n";
  
  const rawDb = await User.collection.findOne({ _id: user._id });
  log += "RAW DB fonCoins: " + rawDb.fonCoins + "\n";
  log += "RAW DB superCoins: " + rawDb.superCoins + "\n";

  fs.writeFileSync("testinc.txt", log);
  process.exit(0);
}

testInc();
