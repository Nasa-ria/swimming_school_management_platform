const mongoose = require('mongoose');
<<<<<<< HEAD
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
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
=======
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const uri = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Extract database name from URI
    const dbName = uri.split('/').pop().split('?')[0] || 'default';

    await mongoose.connect(uri);
    console.log('✅ Database connected successfully');
    console.log(`📊 Database name: ${dbName}`);
    console.log(`🔗 Connection: ${uri.replace(/\/\/.*:.*@/, '//***:***@')}`);
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('💡 Make sure to:');
    console.log('   1. Create a .env file in the root directory');
    console.log('   2. Add your MongoDB URI in MONGODB_URI variable');
    console.log('   Example: MONGODB_URI=mongodb://localhost:27017/swimming_school');
    console.log('   Or for MongoDB Atlas: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/swimming_school');
>>>>>>> 9c8832ded99e64e1c8985a8b551a90cdbf60e154
    process.exit(1);
  }
};

<<<<<<< HEAD
module.exports = connectDB;
=======
module.exports = connectDB;
>>>>>>> 9c8832ded99e64e1c8985a8b551a90cdbf60e154
