require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const connectDB = require('../db');

const run = async () => {
  try {
    await connectDB();
    const res = await Order.updateMany({ payment_method: 'crypto' }, { $set: { payment_method: 'card' } });
    console.log(`Updated ${res.matchedCount || res.n || 0} order(s) from 'crypto' to 'card'.`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

run();
