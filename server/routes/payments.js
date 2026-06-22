const express = require('express');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.post('/initiate', authenticate, async (req, res) => {
  try {
    const { payment_method = 'card' } = req.body;
    const user = await User.findById(req.user.id).populate('cart.product').populate('cart.session');
    if (!user || user.cart.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty.' });
    }

    let totalAmount = 0;
    for (const item of user.cart) {
      if (item.session) {
        const session = item.session;
        if (!session) return res.status(404).json({ error: 'Session item not found.' });
        totalAmount += session.price * item.quantity;
      } else if (item.product) {
        const product = item.product;
        if (!product) return res.status(404).json({ error: 'Product item not found.' });
        totalAmount += product.price * item.quantity;
      }
    }

    if (totalAmount <= 0) {
      return res.status(400).json({ error: 'Unable to calculate payment amount.' });
    }

    const reference = `PAYSTACK_${Date.now()}_${user._id.toString().slice(-6)}`;
    const currency = process.env.PAYSTACK_CURRENCY || 'NGN';
    const publicKey = process.env.VITE_PAYSTACK_PUBLIC_KEY || process.env.PAYSTACK_PUBLIC_KEY;

    return res.json({
      reference,
      email: user.email,
      amount: Math.round(totalAmount * 100),
      currency,
      payment_method,
      publicKey: publicKey || 'pk_test_b8e5c66cb1e8f244122d4f26384a56a6838a5b9b',
      metadata: {
        payment_method,
        customer_name: user.name,
        customer_id: user._id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to initiate payment.' });
  }
});

module.exports = router;

// Paystack webhook receiver (no auth)
router.post('/webhook', express.json(), async (req, res) => {
  try {
    const event = req.body?.event || req.headers['x-paystack-event'];
    const data = req.body?.data || req.body;
    const reference = data?.reference || data?.transaction?.reference;
    if (!reference) return res.status(400).send('No reference');

    // Verify transaction via Paystack API before acting
    const axios = require('axios');
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) return res.status(500).send('Paystack secret not configured');

    const verifyRes = await axios.get(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });

    if (!verifyRes.data?.status || verifyRes.data.data?.status !== 'success') {
      return res.status(400).send('Verification failed');
    }

    // Update Order(s) and Booking(s) that match this reference
    const Order = require('../models/Order');
    const Booking = require('../models/Booking');

    await Order.updateMany({ payment_reference: reference }, { payment_status: 'completed', status: 'completed' });
    await Booking.updateMany({ /* no payment_reference field on Booking currently, but we can match by user/session in metadata if available */ }, {});

    // Acknowledge
    res.status(200).send('ok');
  } catch (err) {
    console.error('Webhook processing error', err.message || err);
    res.status(500).send('error');
  }
});
