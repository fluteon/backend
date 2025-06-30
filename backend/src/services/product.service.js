const cloudinary = require("../config/cloudinary"); // ✅ correct
const Category = require("../models/category.model");
const Product = require("../models/product.model");

// Create a new product
// async function createProduct(req) {

//   try {
//     // Safely log
//     const reqData = req.body;
//     console.log("data",reqData)
//     if (!reqData.size) throw new Error("Missing 'size' field in form data");
//     let sizes = reqData.size;
//     if (typeof sizes === "string") {
//       sizes = JSON.parse(sizes);
//     }
//     // Handle categories
//     let topLevel = await Category.findOne({ name: reqData.topLavelCategory }) || await new Category({ name: reqData.topLavelCategory, level: 1 }).save();
//     let secondLevel = await Category.findOne({ name: reqData.secondLavelCategory, parentCategory: topLevel._id }) || await new Category({ name: reqData.secondLavelCategory, parentCategory: topLevel._id, level: 2 }).save();
//     let thirdLevel = await Category.findOne({ name: reqData.thirdLavelCategory, parentCategory: secondLevel._id }) || await new Category({ name: reqData.thirdLavelCategory, parentCategory: secondLevel._id, level: 3 }).save();

//     // Handle images
//     if (!req.files || req.files.length === 0) throw new Error("No images uploaded");
//   //  const imagePaths = req.files?.images?.map(file => file.path) || [];
// const imagePaths = req.uploadedImageUrls || []; // ✅ accurate URLs


//     const product = new Product({
//       title: reqData.title,
//       color: reqData.color,
//       description: reqData.description,
//       discountedPrice: reqData.discountedPrice,
//       discountPersent: reqData.discountPersent,
//       images: imagePaths,
//       brand: reqData.brand,
//       price: reqData.price,
//       sizes: sizes,
//       quantity: reqData.quantity,
//       category: thirdLevel._id,
//     });
//     return await product.save();
//   } catch (error) {
//     throw new Error(error.message || "Something went wrong");
//   }
// }



// console.log("cloudinary object", cloudinary); 
// console.log("cloudinary uploader available?", !!cloudinary.uploader);


async function createProduct(req) {
  try {
    const reqData = req.body;

    // Parse size string to JSON array
    let sizes = reqData.size;
    if (typeof sizes === "string") sizes = JSON.parse(sizes);

    // Upload images to Cloudinary
    if (!req.files || req.files.length === 0) throw new Error("No images uploaded");

    const uploadResults = await Promise.all(
      req.files.map(file => {
        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        return cloudinary.uploader.upload(base64Image, {
          folder: "ecommerce/products",
        });
      })
    );

    const imageUrls = uploadResults.map(result => result.secure_url);
    console.log("Uploaded image URLs:", imageUrls);

    // Handle category creation
    const topLevel = await Category.findOne({ name: reqData.topLavelCategory }) ||
      await new Category({ name: reqData.topLavelCategory, level: 1 }).save();

    const secondLevel = await Category.findOne({
      name: reqData.secondLavelCategory,
      parentCategory: topLevel._id,
    }) || await new Category({
      name: reqData.secondLavelCategory,
      parentCategory: topLevel._id,
      level: 2,
    }).save();

    const thirdLevel = await Category.findOne({
      name: reqData.thirdLavelCategory,
      parentCategory: secondLevel._id,
    }) || await new Category({
      name: reqData.thirdLavelCategory,
      parentCategory: secondLevel._id,
      level: 3,
    }).save();

    // Create and save product
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

    return await product.save();

  } catch (error) {
    console.error("Create Product Error:", error);
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

// Update a product by ID
async function updateProduct(productId, reqData) {
  const updatedProduct = await Product.findByIdAndUpdate(productId, reqData);
  return updatedProduct;
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


  if (category) {
    const existCategory = await Category.findOne({ name: category });
    if (existCategory)
      query = query.where("category").equals(existCategory._id);
    else return { content: [], currentPage: 1, totalPages:1 };
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


module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  createMultipleProduct,
  searchProducts
};
