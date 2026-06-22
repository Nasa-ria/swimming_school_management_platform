const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Session = require('../models/Session');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// GET /api/cart
router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('cart.product')
      .populate('cart.session');
      
    if (!user) return res.status(404).json({ error: 'User not found.' });
    
    const items = user.cart.map(item => {
      const isSession = !!item.session;
      const ref = isSession ? item.session : item.product;
      
      return {
        id: item._id,
        item_id: ref?._id,
        type: isSession ? 'session' : 'product',
        name: isSession ? ref?.title : ref?.name,
        price: ref?.price,
        image_url: isSession ? null : ref?.image_url,
        stock: isSession ? (ref?.capacity - ref?.enrolled) : ref?.stock,
        quantity: item.quantity
      };
    });
    
    const total = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    res.json({ items, total: parseFloat(total.toFixed(2)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart.' });
  }
});

// POST /api/cart
router.post('/', authenticate, async (req, res) => {
  const { product_id, session_id, quantity = 1 } = req.body;
  if (!product_id && !session_id) return res.status(400).json({ error: 'Product or Session ID is required.' });
  
  try {
    const user = await User.findById(req.user.id);
    
    if (session_id) {
      const session = await Session.findById(session_id);
      if (!session) return res.status(404).json({ error: 'Session not found.' });
      if (session.enrolled >= session.capacity) return res.status(400).json({ error: 'Session is full.' });
      
      const existing = user.cart.find(i => i.session?.toString() === session_id);
      if (existing) return res.status(400).json({ error: 'Session already in cart.' });
      
      user.cart.push({ session: session_id, quantity: 1 });
    } else {
      const product = await Product.findById(product_id);
      if (!product) return res.status(404).json({ error: 'Product not found.' });
      if (product.stock < quantity) return res.status(400).json({ error: 'Insufficient stock.' });
      
      const existingItem = user.cart.find(i => i.product?.toString() === product_id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        user.cart.push({ product: product_id, quantity });
      }
    }
    
    await user.save();
    res.status(201).json({ message: 'Item added to cart.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update cart.' });
  }
});

// ... rest of the routes (PUT/DELETE) remain similar as they use item ID ...
router.put('/:id', authenticate, async (req, res) => {
  const { quantity } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const item = user.cart.id(req.params.id);
    if (!item) return res.status(404).json({ error: 'Cart item not found.' });
    
    item.quantity = quantity;
    await user.save();
    res.json({ message: 'Cart updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cart item.' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart.pull(req.params.id);
    await user.save();
    res.json({ message: 'Item removed from cart.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove cart item.' });
  }
});

router.delete('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();
    res.json({ message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart.' });
  }
});

module.exports = router;
