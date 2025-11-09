const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');

// Initialize categories when module loads
(async () => {
  try {
    await Category.ensureUncategorized();
  } catch (error) {
    console.error('Error ensuring Uncategorized category:', error);
  }
})();

// Get all categories
router.get('/', async (req, res) => {
  try {
    // Sort by createdAt in ascending order (oldest first)
    const categories = await Category.find().sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      categories: categories.map((cat) => ({
        name: cat.name,
        createdAt: cat.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    const categoryName = name.trim();

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: categoryName });
    if (existingCategory) {
      return res.status(200).json({
        success: true,
        message: 'Category already exists',
        category: categoryName,
      });
    }

    // Create new category
    const category = await Category.create({ name: categoryName });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: category.name,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message,
    });
  }
});

// Delete a category
router.delete('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const categoryName = decodeURIComponent(name);

    if (categoryName === 'Uncategorized') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete Uncategorized category',
      });
    }

    // Check if category exists
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if there are any products in this category
    const productsInCategory = await Product.countDocuments({ category: categoryName });
    if (productsInCategory > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${productsInCategory} product(s). Move all products first.`,
        productCount: productsInCategory,
      });
    }

    // Delete category
    await Category.deleteOne({ name: categoryName });

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message,
    });
  }
});

module.exports = router;

