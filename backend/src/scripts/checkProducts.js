// Check products in database
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product.model');
const Category = require('../models/category.model');

async function checkProducts() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_NAME;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all categories
    const categories = await Category.find().sort({ level: 1 });
    console.log('\n=== ALL CATEGORIES ===');
    categories.forEach(cat => {
      console.log(`Name: ${cat.name}, Level: ${cat.level}, ID: ${cat._id}`);
    });

    // Find blazers category
    const blazersCategory = await Category.findOne({ name: 'blazers' });
    console.log('\n=== BLAZERS CATEGORY ===');
    console.log(blazersCategory);

    // Find blazers_sets category
    const blazersSetsCategory = await Category.findOne({ name: 'blazers_sets' });
    console.log('\n=== BLAZERS SETS CATEGORY ===');
    console.log(blazersSetsCategory);

    if (blazersCategory) {
      // Find all products with blazers category
      const blazerProducts = await Product.find({ category: blazersCategory._id })
        .populate('category')
        .select('title color brand quantity createdAt');
      
      console.log('\n=== BLAZER PRODUCTS ===');
      console.log(`Found ${blazerProducts.length} products`);
      blazerProducts.forEach(product => {
        console.log(`- ${product.title} (${product.color}) - Qty: ${product.quantity} - Added: ${product.createdAt}`);
      });
    }

    if (blazersSetsCategory) {
      // Find all products with blazers_sets category
      const blazerSetsProducts = await Product.find({ category: blazersSetsCategory._id })
        .populate('category')
        .select('title color brand quantity createdAt');
      
      console.log('\n=== BLAZER SETS PRODUCTS ===');
      console.log(`Found ${blazerSetsProducts.length} products`);
      blazerSetsProducts.forEach(product => {
        console.log(`- ${product.title} (${product.color}) - Qty: ${product.quantity} - Added: ${product.createdAt}`);
      });
    }

    // Find all products (last 10)
    const allProducts = await Product.find()
      .populate('category')
      .sort({ createdAt: -1 })
      .limit(20)
      .select('title color category createdAt');
    
    console.log('\n=== LAST 20 PRODUCTS ===');
    allProducts.forEach(product => {
      console.log(`- ${product.title} (${product.color}) - Category: ${product.category?.name} - ${product.createdAt}`);
    });

    // Find swimming suit products
    const swimmingSuitCategory = await Category.findOne({ name: 'swimmingsuit' });
    if (swimmingSuitCategory) {
      const swimmingSuitProducts = await Product.find({ category: swimmingSuitCategory._id })
        .populate('category')
        .select('title color brand quantity createdAt');
      
      console.log('\n=== SWIMMING SUIT PRODUCTS ===');
      console.log(`Found ${swimmingSuitProducts.length} products`);
      swimmingSuitProducts.forEach(product => {
        console.log(`- ${product.title} (${product.color}) - Qty: ${product.quantity} - Added: ${product.createdAt}`);
      });
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

checkProducts();
