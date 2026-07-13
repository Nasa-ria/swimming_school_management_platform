// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const connectDB = require('./db');

// // Connect to Database
// connectDB();

// // Middleware
// app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
// app.use(express.json());

// // Request Logger
// // app.use((req, res, next) => {
// //   console.log(`📢 [${req.method}] ${req.url}`);
// //   next();
// // });

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:5173');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   if (req.method === 'OPTIONS') return res.sendStatus(200);
//   next();
// });

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/sessions', require('./routes/sessions'));
// app.use('/api/bookings', require('./routes/bookings'));
// app.use('/api/blog', require('./routes/blog'));
// app.use('/api/products', require('./routes/products'));
// app.use('/api/cart', require('./routes/cart'));
// app.use('/api/orders', require('./routes/orders'));
// app.use('/api/payments', require('./routes/payments'));
// app.use('/api/profile', require('./routes/profile'));
// app.use('/api/admin', require('./routes/admin'));
// app.use('/api/instructor', require('./routes/instructor'));
// app.use('/api/student', require('./routes/student'));

// app.get('/', (req, res) => {
//   res.send('Swimming School API is running...');
// });


// // // 404 Handler for API
// // app.use('/api/*', (req, res) => {
// //   console.log(`❌ 404 NOT FOUND: ${req.originalUrl}`);
// //   res.status(404).json({ error: `Route ${req.originalUrl} not found on this server.` });
// // });

// // app.listen(PORT, () => {
// //   console.log(`🚀 Server running on http://localhost:${PORT}`);
// // });

// // Only listen locally — Vercel serverless doesn't use this
// if (require.main === module) {
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
//   });
// }

// module.exports = app;
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const connectDB = require('./db');

const startDatabase = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('⚠️ Database connection failed during startup:', err.message);
  }
};

if (!process.env.VERCEL) {
  startDatabase();
}

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
  'https://swimming-school-management-platform.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(null, false);
  },
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/', (req, res) => {
  res.send('Swimming School API is running...');
});

const loadRoute = (path, handler) => {
  try {
    app.use(path, require(handler));
  } catch (err) {
    console.error(`Failed to load route ${path}:`, err.message);
  }
};

loadRoute('/api/auth', './routes/auth');
loadRoute('/api/sessions', './routes/sessions');
loadRoute('/api/bookings', './routes/bookings');
loadRoute('/api/blog', './routes/blog');
loadRoute('/api/products', './routes/products');
loadRoute('/api/cart', './routes/cart');
loadRoute('/api/orders', './routes/orders');
loadRoute('/api/payments', './routes/payments');
loadRoute('/api/profile', './routes/profile');
loadRoute('/api/admin', './routes/admin');
loadRoute('/api/instructor', './routes/instructor');
loadRoute('/api/student', './routes/student');

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;