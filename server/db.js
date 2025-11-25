const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const uri = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(uri);
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('💡 Make sure to:');
    console.log('   1. Create a .env file in the root directory');
    console.log('   2. Add your MongoDB URI in MONGODB_URI variable');
    console.log('   Example: MONGODB_URI=mongodb://localhost:27017/swimming_school');
    console.log('   Or for MongoDB Atlas: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/swimming_school');
    process.exit(1);
  }
};

module.exports = connectDB;