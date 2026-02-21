const cloudinary = require("../config/cloudinary"); // ✅ correct
const Category = require("../models/category.model");
const Product = require("../models/product.model");

async function createProduct(req) {
  try {
    console.log("🔍 Product Service: Starting product creation");
    const reqData = req.body;
    console.log("Request data:", reqData);

    // Parse size string to JSON array
    let sizes = reqData.size;
    if (typeof sizes === "string") sizes = JSON.parse(sizes);
    console.log("Parsed sizes:", sizes);

    // Debug: Check what we received
    console.log("req.files:", req.files);
    console.log("req.files type:", typeof req.files);
    console.log("req.files length:", req.files ? req.files.length : 'N/A');
    console.log("req.file:", req.file);

    // Upload images to Cloudinary
    if (!req.files || req.files.length === 0) {
      throw new Error("No images uploaded. Please select at least one image.");
    }
    console.log(`Uploading ${req.files.length} images to Cloudinary...`);

    const uploadResults = await Promise.all(
      req.files.map(file => {
        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        return cloudinary.uploader.upload(base64Image, {
          folder: "ecommerce/products",
        });
      })
    );

    const imageUrls = uploadResults.map(result => result.secure_url);
    console.log("✅ Images uploaded:", imageUrls.length);

    // Handle category creation
    console.log("Finding/creating categories...");
    const topLevel = await Category.findOne({ name: reqData.topLavelCategory }) ||
      await new Category({ name: reqData.topLavelCategory, level: 1 }).save();
    console.log("Top level category:", topLevel.name);

    const secondLevel = await Category.findOne({
      name: reqData.secondLavelCategory,
      parentCategory: topLevel._id,
    }) || await new Category({
      name: reqData.secondLavelCategory,
      parentCategory: topLevel._id,
      level: 2,
    }).save();
    console.log("Second level category:", secondLevel.name);

    const thirdLevel = await Category.findOne({
      name: reqData.thirdLavelCategory,
      parentCategory: secondLevel._id,
    }) || await new Category({
      name: reqData.thirdLavelCategory,
      parentCategory: secondLevel._id,
      level: 3,
    }).save();
    console.log("Third level category:", thirdLevel.name);

    // Create and save product
    console.log("Creating product document...");
    const product = new Product({
      title: reqData.title,
      description: reqData.description,
      discountedPrice: reqData.discountedPrice,
      discountPersent: reqData.discountPersent,
      imageUrl: imageUrls,
      brand: reqData.brand,
      price: reqData.price,
      sizes: sizes,
      quantity: reqData.quantity,
      color: reqData.color,
      category: thirdLevel._id,
    });

    console.log("Saving product to database...");
    const savedProduct = await product.save();
    console.log("✅ Product saved successfully! ID:", savedProduct._id);
    
    return savedProduct;

  } catch (error) {
    console.error("❌ Create Product Error:", error.message);
    console.error("Full error:", error);
    throw new Error(error.message || "Something went wrong");
  }
}

// Delete a product by ID
async function deleteProduct(productId) {
  const product = await findProductById(productId);

  if (!product) {
    throw new Error("product not found with id - : ", productId);
  }

  await Product.findByIdAndDelete(productId);

  return "Product deleted Successfully";
}

async function updateProduct(productId, reqData, files = []) {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    console.log("📝 Updating product:", productId);
    console.log("📂 Received categories:", {
      top: reqData.topLavelCategory,
      second: reqData.secondLavelCategory,
      third: reqData.thirdLavelCategory
    });

    // ✅ Fix: Ensure size is properly extracted and parsed
    let sizes = [];
    console.log("Received size in reqData:", reqData.size);

    if (reqData.size) {
      try {
        const parsedSize = typeof reqData.size === "string"
          ? JSON.parse(reqData.size)
          : reqData.size;

        if (!Array.isArray(parsedSize)) throw new Error("Size must be an array");

        sizes = parsedSize.map(({ name, quantity }) => ({
          name,
          quantity: Number(quantity),
        }));
      } catch (err) {
        throw new Error("Invalid size format");
      }
    } else {
      throw new Error("Size data is required");
    }

    // ✅ Handle images
    let imageUrls = product.imageUrl;
    
    // If new files are uploaded, use them
    if (files.length > 0) {
      const uploadResults = await Promise.all(
        files.map((file) => {
          const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
          return cloudinary.uploader.upload(base64Image, {
            folder: "ecommerce/products",
          });
        })
      );
      imageUrls = uploadResults.map((res) => res.secure_url);
    } 
    // If existingImages is provided (when editing without new uploads), use those
    else if (reqData.existingImages) {
      try {
        imageUrls = typeof reqData.existingImages === "string" 
          ? JSON.parse(reqData.existingImages) 
          : reqData.existingImages;
        console.log("✅ Keeping existing images:", imageUrls.length);
      } catch (err) {
        console.log("⚠️ Failed to parse existingImages, keeping current images");
      }
    }
    // Otherwise keep the existing product images (no change)

    // ✅ Category handling
    let categoryId = product.category; // Keep original category by default
    
    if (reqData.topLavelCategory && reqData.secondLavelCategory && reqData.thirdLavelCategory) {
      console.log("🔄 Updating category hierarchy...");
      
      const top = await Category.findOne({ name: reqData.topLavelCategory }) ||
        await new Category({ name: reqData.topLavelCategory, level: 1 }).save();

      const mid = await Category.findOne({
        name: reqData.secondLavelCategory,
        parentCategory: top._id,
      }) || await new Category({
        name: reqData.secondLavelCategory,
        parentCategory: top._id,
        level: 2,
      }).save();

      const bottom = await Category.findOne({
        name: reqData.thirdLavelCategory,
        parentCategory: mid._id,
      }) || await new Category({
        name: reqData.thirdLavelCategory,
        parentCategory: mid._id,
        level: 3,
      }).save();

      categoryId = bottom._id;
      console.log("✅ Category updated to:", reqData.thirdLavelCategory);
    } else {
      console.log("⚠️ Category data incomplete, keeping original category");
    }

    // ✅ Update product fields
    product.set({
      title: reqData.title?.trim(),
      description: reqData.description?.trim(),
      price: Number(reqData.price),
      discountedPrice: Number(reqData.discountedPrice),
      discountPersent: Number(reqData.discountPersent),
      quantity: Number(reqData.quantity),
      brand: reqData.brand?.trim(),
color:
  typeof reqData.color === "string"
    ? reqData.color.startsWith("[")
      ? JSON.parse(reqData.color)
      : [reqData.color]
    : reqData.color,
      sizes,
      imageUrl: imageUrls,
      category: categoryId,
    });

    await product.save();
    const updated = await Product.findById(productId).populate("category");

    return updated;

  } catch (error) {
    console.error("Update Product Error:", error);
    throw new Error(error.message || "Update failed");
  }
}







// Find a product by ID
async function findProductById(id) {
  const product = await Product.findById(id).populate("category").exec();

  if (!product) {
    throw new Error("Product not found with id " + id);
  }
  return product;
}

// Get all products with filtering and pagination
async function getAllProducts(reqQuery) {
  let {
    category,
    color,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    sort,
    stock,
    pageNumber,
    pageSize,
  } = reqQuery;
  (pageSize = pageSize || 10), (pageNumber = pageNumber || 1);
  let query = Product.find().populate("category");


  // if (category) {
  //   const existCategory = await Category.findOne({ name: category });
  //   if (existCategory)
  //     query = query.where("category").equals(existCategory._id);
  //   else return { content: [], currentPage: 1, totalPages:1 };
  // }

if (category) {
  const existCategory = await Category.findOne({ name: category });

  if (!existCategory) {
    return { content: [], currentPage: 1, totalPages: 1 };
  }

  const allCategoryIds = new Set([existCategory._id.toString()]);

  // Recursively collect children (like you do in searchProducts)
  async function getChildrenRecursive(parentIds) {
    const children = await Category.find({ parentCategory: { $in: parentIds } });
    for (const child of children) {
      allCategoryIds.add(child._id.toString());
    }
    if (children.length > 0) {
      await getChildrenRecursive(children.map((c) => c._id));
    }
  }

  await getChildrenRecursive([existCategory._id]);

  // Filter products in any of those categories
  query = query.where("category").in([...allCategoryIds]);
}


  if (color) {
    const colorSet = new Set(color.split(",").map(color => color.trim().toLowerCase()));
    const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
    query = query.where("color").regex(colorRegex);
    // query = query.where("color").in([...colorSet]);
  }

  if (sizes) {
    const sizesSet = new Set(sizes);
    
    query = query.where("sizes.name").in([...sizesSet]);
  }

  if (minPrice && maxPrice) {
    query = query.where("discountedPrice").gte(minPrice).lte(maxPrice);
  }

  if (minDiscount) {
    query = query.where("discountPersent").gt(minDiscount);
  }

  if (stock) {
    if (stock === "in_stock") {
      query = query.where("quantity").gt(0);
    } else if (stock === "out_of_stock") {
      query = query.where("quantity").lte(0);
    }
  }

  if (sort) {
    const sortDirection = sort === "price_high" ? -1 : 1;
    query = query.sort({ discountedPrice: sortDirection });
  }

  // Apply pagination
  const totalProducts = await Product.countDocuments(query);

  const skip = (pageNumber - 1) * pageSize;

  query = query.skip(skip).limit(pageSize);

  const products = await query.exec();

  const totalPages = Math.ceil(totalProducts / pageSize);


  return { content: products, currentPage: pageNumber, totalPages:totalPages };
}

async function createMultipleProduct(products) {
  for (let product of products) {
    await createProduct(product);
  }
}



function normalizeText(text) {
  return text.trim().toLowerCase().replace(/s$/, ""); // removes plural 's' (basic plural support)
}

async function searchProducts(query) {
  const normalizedQuery = query.trim().toLowerCase();

  // Find matching categories (case-insensitive)
  const matchingCategories = await Category.find({
    name: { $regex: new RegExp(normalizedQuery, "i") },
  });

  const matchingCategoryIds = matchingCategories.map((cat) => cat._id);

  // Collect all child categories recursively
  const allCategoryIds = new Set(matchingCategoryIds.map(id => id.toString()));

  async function fetchChildCategories(parentIds) {
    const children = await Category.find({ parentCategory: { $in: parentIds } });
    for (const child of children) {
      allCategoryIds.add(child._id.toString());
    }
    if (children.length > 0) {
      await fetchChildCategories(children.map((c) => c._id));
    }
  }

  await fetchChildCategories(matchingCategoryIds);

  // Now find products in those categories
  const products = await Product.find({
    category: { $in: [...allCategoryIds] },
  }).populate({
    path: "category",
    populate: {
      path: "parentCategory",
      populate: {
        path: "parentCategory",
      },
    },
  });

  return products;
}

// Get similar products based on same category
async function getSimilarProducts(productId, limit = 8) {
  try {
    const product = await Product.findById(productId).populate('category');
    
    if (!product) {
      throw new Error('Product not found');
    }

    // Find products in the same category, excluding the current product
    const similarProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: productId }
    })
    .populate({
      path: "category",
      populate: {
        path: "parentCategory",
        populate: {
          path: "parentCategory",
        },
      },
    })
    .limit(limit)
    .sort({ numRatings: -1, createdAt: -1 }); // Sort by ratings and recency

    return similarProducts;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get complementary products for cart (cross-sell logic)
async function getComplementaryProducts(categoryNames, limit = 6) {
  try {
    console.log("🎯 getComplementaryProducts called with:", { categoryNames, limit });
    
    // If no categories provided, return trending products
    if (!categoryNames || categoryNames.length === 0) {
      console.log("⚡ No categories provided, returning trending products");
      const trendingProducts = await Product.find({})
        .populate({
          path: "category",
          populate: {
            path: "parentCategory",
            populate: {
              path: "parentCategory",
            },
          },
        })
        .limit(limit)
        .sort({ numRatings: -1, createdAt: -1 });
      console.log("📈 Returning", trendingProducts.length, "trending products");
      return trendingProducts;
    }
    
    // Complementary mapping
    const complementaryMap = {
      'Shirt': ['Pant', 'Jeans', 'Trousers'],
      'T-Shirt': ['Jeans', 'Shorts', 'Pant'],
      'Kurta': ['Churidar', 'Pant', 'Pajama'],
      'Top': ['Jeans', 'Skirt', 'Trousers'],
      'Dress': ['Shoes', 'Jacket', 'Accessories'],
      'Saree': ['Blouse', 'Petticoat'],
      'Jeans': ['Shirt', 'T-Shirt', 'Top'],
      'Pant': ['Shirt', 'T-Shirt'],
      'Shoes': ['Socks', 'Shoe Care']
    };

    // Get complementary category names based on cart items
    const complementaryCategories = new Set();
    
    categoryNames.forEach(categoryName => {
      console.log("🔍 Checking category:", categoryName);
      const complements = complementaryMap[categoryName];
      if (complements) {
        console.log("✅ Found complements for", categoryName, ":", complements);
        complements.forEach(cat => complementaryCategories.add(cat));
      } else {
        console.log("⚠️ No complements found for", categoryName);
      }
    });

    console.log("📦 All complementary categories:", Array.from(complementaryCategories));

    if (complementaryCategories.size === 0) {
      console.log("⚠️ No complementary categories found, returning trending products");
      // If no specific complements, return trending products
      const trendingProducts = await Product.find({})
        .populate({
          path: "category",
          populate: {
            path: "parentCategory",
            populate: {
              path: "parentCategory",
            },
          },
        })
        .limit(limit)
        .sort({ numRatings: -1, createdAt: -1 });
      console.log("📈 Returning", trendingProducts.length, "trending products");
      return trendingProducts;
    }

    // Find categories that match complementary names
    const categories = await Category.find({
      name: { $in: Array.from(complementaryCategories) }
    });

    console.log("🏷️ Found", categories.length, "matching categories in DB");
    
    if (categories.length === 0) {
      console.log("⚠️ No matching categories in DB, returning trending products");
      const trendingProducts = await Product.find({})
        .populate({
          path: "category",
          populate: {
            path: "parentCategory",
            populate: {
              path: "parentCategory",
            },
          },
        })
        .limit(limit)
        .sort({ numRatings: -1, createdAt: -1 });
      console.log("📈 Returning", trendingProducts.length, "trending products");
      return trendingProducts;
    }
    
    const categoryIds = categories.map(cat => cat._id);
    console.log("🆔 Category IDs:", categoryIds);

    // Find products in complementary categories
    const complementaryProducts = await Product.find({
      category: { $in: categoryIds }
    })
    .populate({
      path: "category",
      populate: {
        path: "parentCategory",
        populate: {
          path: "parentCategory",
        },
      },
    })
    .limit(limit)
    .sort({ numRatings: -1, createdAt: -1 });

    console.log("✅ Found", complementaryProducts.length, "complementary products");
    return complementaryProducts;
  } catch (error) {
    console.error("❌ Error in getComplementaryProducts:", error);
    // Return trending products as fallback on error
    try {
      const fallbackProducts = await Product.find({})
        .populate({
          path: "category",
          populate: {
            path: "parentCategory",
            populate: {
              path: "parentCategory",
            },
          },
        })
        .limit(limit)
        .sort({ numRatings: -1, createdAt: -1 });
      console.log("🔄 Returning", fallbackProducts.length, "fallback products");
      return fallbackProducts;
    } catch (fallbackError) {
      console.error("❌ Fallback also failed:", fallbackError);
      return []; // Return empty array as last resort
    }
  }
}

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  createMultipleProduct,
  searchProducts,
  getSimilarProducts,
  getComplementaryProducts
};
