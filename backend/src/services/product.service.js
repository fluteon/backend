const cloudinary = require("../config/cloudinary"); // ✅ correct
const Category = require("../models/category.model");
const Product = require("../models/product.model");

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

async function updateProduct(productId, reqData, files = []) {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

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

    // ✅ Category handling
    let categoryId = product.category;
    if (reqData.topLavelCategory && reqData.secondLavelCategory && reqData.thirdLavelCategory) {
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
