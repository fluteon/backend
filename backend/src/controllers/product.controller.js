// productController.js
const productService = require("../services/product.service.js")

// Create a new product
async function createProduct(req, res) {
  try {
    console.log("📝 Creating product...");
    console.log("Request body:", req.body);
    console.log("Files:", req.files ? req.files.length : 0);
    
    const product = await productService.createProduct(req);
    
    console.log("✅ Product created successfully:", product._id);
    return res.status(201).json(product);
  } catch (err) {
    console.error("❌ Product creation failed:", err.message);
    console.error("Full error:", err);
    return res.status(500).json({ error: err.message });
  }
}



// Delete a product by ID
async function deleteProduct(req, res) {
  try {
    const productId = req.params.id;
    const message = await productService.deleteProduct(productId);
    return res.json({ message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update a product by ID
async function updateProduct(req, res) {
  try {
    const productId = req.params.id;
    const files = req.files?.images || []; // extract images array
    const product = await productService.updateProduct(productId, req.body, files);
    return res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}




// Find a product by ID
async function findProductById(req, res) {
  try {
    const productId = req.params.id;
    const product = await productService.findProductById(productId);
    return res.status(200).send(product);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
}

// Find products by category
async function findProductByCategory(req, res) {
  try {
    const category = req.params.category;
    const products = await productService.findProductByCategory(category);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all products with filtering and pagination
async function getAllProducts(req, res) {
  try {

    const products = await productService.getAllProducts(req.query);

    return res.status(200).send(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

const createMultipleProduct= async (req, res) => {
  try {
    await productService.createMultipleProduct(req.body)
    res
      .status(202)
      .json({ message: "Products Created Successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};



const searchProduct = async (req, res) => {
  try {
    const { query } = req.query;
    const products = await productService.searchProducts(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get similar products based on category
const getSimilarProducts = async (req, res) => {
  try {
    const productId = req.params.id;
    const limit = parseInt(req.query.limit) || 8;
    const products = await productService.getSimilarProducts(productId, limit);
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get complementary products for cart
const getComplementaryProducts = async (req, res) => {
  try {
    console.log("🛒 Complementary Products Request Body:", req.body);
    const { categories } = req.body; // Array of category names from cart items
    const limit = parseInt(req.query.limit) || 6;
    console.log("📋 Categories received:", categories);
    console.log("🔢 Limit:", limit);
    const products = await productService.getComplementaryProducts(categories, limit);
    console.log("✅ Complementary products found:", products.length);
    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Complementary products error:", error);
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  findProductByCategory,
  searchProduct,
  createMultipleProduct,
  getSimilarProducts,
  getComplementaryProducts

};
