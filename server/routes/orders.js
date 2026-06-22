const express = require('express');
const axios = require('axios');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { authenticate, isAdmin } = require('../middleware/auth');
const router = express.Router();

const Session = require('../models/Session');
const Booking = require('../models/Booking');

const verifyPaystackTransaction = async (reference, expectedAmount) => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) throw new Error('Paystack secret key is not configured.');

  const response = await axios.get(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });

  if (!response.data?.status || response.data.data?.status !== 'success') return null;

  const paidAmount = Number(response.data.data.amount) / 100;
  if (Math.abs(paidAmount - expectedAmount) > 0.01) return null;

  return response.data.data;
};

// Mock email service for notifications
const sendConfirmationEmail = (user, session) => {
  console.log('----------------------------------------');
  console.log(`EMAIL SENT TO: ${user.email}`);
  console.log(`SUBJECT: Booking Confirmed - ${session.title}`);
  console.log(`BODY: Hello ${user.name},\nYour booking for ${session.title} on ${new Date(session.start_time).toLocaleDateString()} is confirmed.\nPayment received successfully.`);
  console.log('----------------------------------------');
};

// POST /api/orders
router.post('/', authenticate, async (req, res) => {
  let { shipping_address, payment_method = 'card', payment_reference } = req.body;
  try {
    const user = await User.findById(req.user.id).populate('cart.product').populate('cart.session');
    if (!user || user.cart.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty.' });
    }

    const orderItems = [];
    const sessionsToBook = [];
    let totalAmount = 0;

    for (const item of user.cart) {
      if (item.session) {
        const session = item.session;
        if (session.enrolled >= session.capacity) {
          return res.status(400).json({ error: `Session "${session.title}" is full.` });
        }

        sessionsToBook.push({ session, quantity: item.quantity });
        totalAmount += session.price * item.quantity;
      } else if (item.product) {
        const product = item.product;
        if (product.stock < item.quantity) {
          return res.status(400).json({ error: `Insufficient stock for "${product.name}".` });
        }

        orderItems.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        });
        totalAmount += product.price * item.quantity;
      }
    }

    if (payment_method !== 'offline' && !payment_reference) {
      return res.status(400).json({ error: 'Payment reference is required for online checkout.' });
    }

    if (payment_reference) {
      const verification = await verifyPaystackTransaction(payment_reference, totalAmount);
      if (!verification) {
        return res.status(400).json({ error: 'Paystack payment verification failed.' });
      }
      payment_method = payment_method || verification.metadata?.payment_method || 'card';
    }

    const bookingPromises = sessionsToBook.map(async ({ session, quantity }) => {
      const booking = new Booking({
        session: session._id,
        user: user._id,
        status: payment_reference ? 'confirmed' : 'pending',
        payment_status: payment_reference ? 'completed' : 'pending',
      });
      await booking.save();

      session.enrolled += quantity;
      await session.save();
    });

    await Promise.all(bookingPromises);

    let order_id = null;
    if (orderItems.length > 0) {
      const order = new Order({
        user: req.user.id,
        items: orderItems,
        total_amount: totalAmount,
        status: payment_reference ? 'completed' : 'pending',
        payment_method,
        payment_status: payment_reference ? 'completed' : 'pending',
        payment_reference,
        shipping_address,
      });
      await order.save();
      order_id = order._id;
    }

    for (const { session } of sessionsToBook) {
      sendConfirmationEmail(user, session);
    }

    user.cart = [];
    await user.save();

    res.status(201).json({ message: 'Order placed successfully!', order_id, payment_reference });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order.' });
  }
});

// GET /api/orders
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// GET /api/orders/admin/all (admin only)
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all orders.' });
  }
});

// GET /api/orders/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product').populate('user', 'name email');
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
});

// PUT /api/orders/:id/status
router.put('/:id/status', authenticate, isAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    await Order.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: 'Order status updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order.' });
  }
});

module.exports = router;
