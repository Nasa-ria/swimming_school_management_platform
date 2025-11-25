const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();


const app = express();
const PORT = process.env.PORT || 9000;

const connectDB = require('../db');
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Swimming School API is running',
    timestamp: new Date().toISOString()
  });
});

// Placeholder routes - uncomment and create route files as needed
const authRoutes = require('./Routes/authRoutes');
// const sessionsRoutes = require('./routes/sessions');
// const bookingsRoutes = require('./routes/bookings');
// const blogRoutes = require('./routes/blog');
// const productsRoutes = require('./routes/products');
// const cartRoutes = require('./routes/cart');
// const ordersRoutes = require('./routes/orders');
// const profileRoutes = require('./routes/profile');

// Use routes - uncomment as you create them
app.use('/api/auth', authRoutes);
// app.use('/api/sessions', sessionsRoutes);
// app.use('/api/bookings', bookingsRoutes);
// app.use('/api/blog', blogRoutes);
// app.use('/api/products', productsRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/orders', ordersRoutes);
// app.use('/api/profile', profileRoutes);

// Sample API endpoints to get you started
app.get('/api/sessions', (req, res) => {
  res.json({
    message: 'Sessions endpoint - implement your logic here',
    data: []
  });
});

app.get('/api/products', (req, res) => {
  res.json({
    message: 'Products endpoint - implement your logic here',
    data: []
  });
});

app.get('/api/blog/posts', (req, res) => {
  res.json({
    message: 'Blog posts endpoint - implement your logic here',
    data: []
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.url} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});

