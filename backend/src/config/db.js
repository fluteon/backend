
const mongoose = require("mongoose");
require("dotenv").config();
const mongoDbUrl = process.env.MONGODB_NAME;

const connectDb = async () => {
  try {
    await mongoose.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Connection pooling for production (Render + Atlas)
      maxPoolSize: 50,        // Maximum connections in pool
      minPoolSize: 10,        // Minimum connections to maintain
      serverSelectionTimeoutMS: 5000,  // Timeout for server selection
      socketTimeoutMS: 45000,  // Socket timeout
      family: 4,              // Use IPv4
      connectTimeoutMS: 10000, // Connection timeout
    });
    console.log("✅ MongoDB connected successfully");
    console.log(`📊 Connection pool: min=${mongoose.connection.config.minPoolSize}, max=${mongoose.connection.config.maxPoolSize}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// Monitor connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected');
});

module.exports = { connectDb };
