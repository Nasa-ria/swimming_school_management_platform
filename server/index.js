const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const connectDB = require('./db');
const authRoutes = require('./Controllers/authController');

// Connect to Database
connectDB();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
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

