const express = require('express');
const Product = require('../models/Product');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
  const { category, search, sort } = req.query;
  try {
    let query = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };

    const products = await Product.find(query).sort(sortOption);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// GET /api/products/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories.filter(c => !!c));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
});

// POST /api/products (admin)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: 'Product created.', id: product._id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product.' });
  }
});

// PUT /api/products/:id (admin)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Product updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

// DELETE /api/products/:id (admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

module.exports = router;
