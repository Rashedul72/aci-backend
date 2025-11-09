const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// Save a product to database
router.post('/', async (req, res) => {
  try {
    const { material, barcode, description, category } = req.body;

    // Validate required fields
    if (!material || !barcode || !description) {
      return res.status(400).json({
        success: false,
        message: 'Material, barcode, and description are required',
      });
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ barcode });
    if (existingProduct) {
      return res.status(200).json({
        success: true,
        message: 'Product already exists',
        product: existingProduct,
      });
    }

    // Determine category (default to Uncategorized)
    const productCategory = category || 'Uncategorized';

    // Ensure category exists in database
    const categoryExists = await Category.findOne({ name: productCategory });
    if (!categoryExists) {
      await Category.create({ name: productCategory });
    }

    // Create new product
    const productData = {
      material,
      barcode,
      description,
      category: productCategory,
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product saved successfully',
      product,
    });
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving product',
      error: error.message,
    });
  }
});

// Get all products (optionally filtered by category)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
});

// Get a single product by barcode
router.get('/:barcode', async (req, res) => {
  try {
    const { barcode } = req.params;

    const product = await Product.findOne({ barcode });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    });
  }
});

// Update product category
router.patch('/:id/category', async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      });
    }

    // Ensure category exists in database
    const categoryExists = await Category.findOne({ name: category });
    if (!categoryExists) {
      await Category.create({ name: category });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { category },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product category updated successfully',
      product,
    });
  } catch (error) {
    console.error('Error updating product category:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product category',
      error: error.message,
    });
  }
});

module.exports = router;

