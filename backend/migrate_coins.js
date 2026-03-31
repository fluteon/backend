const { connectDb } = require("./src/config/db");
const mongoose = require("mongoose");
const User = require("./src/models/user.model.js");

async function migrate() {
  await connectDb();
  
  console.log("🔍 Scanning for users to migrate...");
  const users = await User.collection.find({}).toArray();
  let migratedCount = 0;
  
  for (let user of users) {
    let newCoins = 0;
    
    // Safely combine old coins and any new coins recorded, discarding NaNs
    if (typeof user.fonCoins === 'number' && !isNaN(user.fonCoins)) {
      newCoins = user.fonCoins;
    } else if (typeof user.superCoins === 'number' && !isNaN(user.superCoins)) {
      newCoins = user.superCoins;
    }

    // Update MongoDB natively bypassing Mongoose schema strictness
    await User.collection.updateOne(
      { _id: user._id },
      { 
        $set: { fonCoins: newCoins },
        $unset: { superCoins: "" }
      }
    );
    migratedCount++;
  }
  
  console.log(`✅ Successfully migrated/fixed ${migratedCount} user records.`);
  process.exit(0);
}

migrate();
