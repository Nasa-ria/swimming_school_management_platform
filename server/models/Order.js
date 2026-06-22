const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total_amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  payment_method: { type: String, enum: ['card', 'momo', 'offline'], default: 'offline' },
  payment_status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  payment_reference: String,
  shipping_address: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
