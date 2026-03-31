require("dotenv").config();
const { connectDb } = require("./src/config/db");
const mongoose = require("mongoose");
const User = require("./src/models/user.model.js");

async function fixCoins() {
  await connectDb();
  
  console.log("🔍 Scanning for users to fix DB fields...");
  const users = await User.collection.find({}).toArray();
  let migratedCount = 0;
  
  for (let user of users) {
    let finalCoins = 0;
    
    // Safely combine both values
    const fon = (typeof user.fonCoins === 'number' && !isNaN(user.fonCoins)) ? user.fonCoins : 0;
    const superC = (typeof user.superCoins === 'number' && !isNaN(user.superCoins)) ? user.superCoins : 0;
    
    finalCoins = Math.max(0, fon + superC);

    // Completely drop superCoins and set fonCoins
    await User.collection.updateOne(
      { _id: user._id },
      { 
        $set: { fonCoins: finalCoins },
        $unset: { superCoins: 1 }   // Correct MongoDB convention for unsetting a field
      }
    );
    migratedCount++;
    console.log(`✅ Fixed user ${user.email} -> fonCoins: ${finalCoins}`);
  }
  
  console.log(`✅ Successfully cleaned up ${migratedCount} user records! superCoins completely dropped.`);
  process.exit(0);
}

fixCoins();
