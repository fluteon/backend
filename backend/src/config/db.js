
const mongoose = require("mongoose");
require("dotenv").config();
const mongoDbUrl = process.env.MONGODB_NAME;

const connectDb = async () => {
  try {
    await mongoose.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully", mongoDbUrl);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Optional: exit if DB connection fails
  }
};

module.exports = { connectDb };
