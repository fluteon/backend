const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller.js");
const authenticate = require("../middleware/authenticat.js");

// Get all categories
router.get("/", authenticate, categoryController.getAllCategories);

// Get category hierarchy for product forms
router.get("/hierarchy", authenticate, categoryController.getCategoryHierarchy);

// Get categories by level
router.get("/level/:level", authenticate, categoryController.getCategoriesByLevel);

// Get child categories
router.get("/children/:parentId", authenticate, categoryController.getChildCategories);

// Create a new category
router.post("/", authenticate, categoryController.createCategory);

// Update a category
router.put("/:id", authenticate, categoryController.updateCategory);

// Delete a category
router.delete("/:id", authenticate, categoryController.deleteCategory);

module.exports = router;
