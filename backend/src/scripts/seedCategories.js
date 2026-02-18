const mongoose = require("mongoose");
const Category = require("../models/category.model.js");
const dotenv = require("dotenv");

dotenv.config();

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_NAME);
    console.log("✅ MongoDB connected");

    // Check if top-level categories already exist
    const existingCategories = await Category.find({ level: 1 });
    
    if (existingCategories.length > 0) {
      console.log("ℹ️  Top-level categories already exist:");
      existingCategories.forEach(cat => {
        console.log(`   - ${cat.name} (ID: ${cat._id})`);
      });
      process.exit(0);
    }

    // Create top-level categories
    const topCategories = [
      { name: "women", level: 1, parentCategory: null },
      { name: "men", level: 1, parentCategory: null },
      { name: "kids", level: 1, parentCategory: null },
    ];

    const createdCategories = await Category.insertMany(topCategories);
    
    console.log("✅ Top-level categories created successfully:");
    createdCategories.forEach(cat => {
      console.log(`   - ${cat.name} (ID: ${cat._id})`);
    });

    console.log("\n📝 Note: You can now add second-level and third-level categories through the admin panel.");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();
