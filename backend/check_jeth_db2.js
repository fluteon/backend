require("dotenv").config();
const { connectDb } = require("./src/config/db");
const User = require("./src/models/user.model.js");
const fs = require('fs');

async function check() {
  await connectDb();
  const dbUser = await User.collection.findOne({ email: "gb3454304@gmail.com" });
  fs.writeFileSync('jethalal_db_dump.txt', JSON.stringify({fonCoins: dbUser.fonCoins, superCoins: dbUser.superCoins}));
  process.exit(0);
}
check();
