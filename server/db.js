const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
    console.log(`📡 Attempting to connect to: ${maskedUri}`);
  }
  try {
    const conn = await mongoose.connect(uri || 'mongodb://localhost:27017/swimming_school', {
      autoIndex: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    return null;
  }
};

module.exports = connectDB;
