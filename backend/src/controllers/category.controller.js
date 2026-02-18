const Category = require("../models/category.model.js");

// Get all categories
async function getAllCategories(req, res) {
  try {
    const categories = await Category.find().populate("parentCategory").sort({ level: 1, name: 1 });
    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get categories by level
async function getCategoriesByLevel(req, res) {
  try {
    const { level } = req.params;
    const categories = await Category.find({ level: parseInt(level) })
      .populate("parentCategory")
      .sort({ name: 1 });
    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get child categories
async function getChildCategories(req, res) {
  try {
    const { parentId } = req.params;
    const categories = await Category.find({ parentCategory: parentId })
      .populate("parentCategory")
      .sort({ name: 1 });
    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Create a new category
async function createCategory(req, res) {
  try {
    const { name, parentCategory, level } = req.body;

    // Validate required fields
    if (!name || level === undefined) {
      return res.status(400).json({ error: "Name and level are required" });
    }

    // For level 2 and 3, parentCategory is required
    if ((level === 2 || level === 3) && !parentCategory) {
      return res.status(400).json({ error: "Parent category is required for this level" });
    }

    // Check if category already exists at this level with same parent
    const existingCategory = await Category.findOne({
      name: name.toLowerCase().trim(),
      level,
      parentCategory: parentCategory || null,
    });

    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    // Create new category
    const category = new Category({
      name: name.toLowerCase().trim(),
      parentCategory: parentCategory || null,
      level: parseInt(level),
    });

    await category.save();
    const populatedCategory = await Category.findById(category._id).populate("parentCategory");

    return res.status(201).json(populatedCategory);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update a category
async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, parentCategory } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (name) {
      category.name = name.toLowerCase().trim();
    }
    if (parentCategory !== undefined) {
      category.parentCategory = parentCategory || null;
    }

    await category.save();
    const updatedCategory = await Category.findById(id).populate("parentCategory");

    return res.status(200).json(updatedCategory);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Delete a category
async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    // Check if category has children
    const hasChildren = await Category.findOne({ parentCategory: id });
    if (hasChildren) {
      return res.status(400).json({ 
        error: "Cannot delete category with subcategories. Delete subcategories first." 
      });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get category hierarchy
async function getCategoryHierarchy(req, res) {
  try {
    // Get all top-level categories
    const topCategories = await Category.find({ level: 1 }).sort({ name: 1 });
    
    const hierarchy = {};
    
    for (const topCat of topCategories) {
      // Get second-level categories
      const secondLevel = await Category.find({ 
        parentCategory: topCat._id, 
        level: 2 
      }).sort({ name: 1 });
      
      hierarchy[topCat.name] = {};
      
      for (const secondCat of secondLevel) {
        // Get third-level categories
        const thirdLevel = await Category.find({ 
          parentCategory: secondCat._id, 
          level: 3 
        }).sort({ name: 1 });
        
        hierarchy[topCat.name][secondCat.name] = thirdLevel.map(cat => ({
          value: cat.name,
          label: cat.name.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          _id: cat._id
        }));
      }
    }
    
    return res.status(200).json(hierarchy);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllCategories,
  getCategoriesByLevel,
  getChildCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryHierarchy,
};
