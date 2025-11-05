const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/swimming_school';
let client;

async function connectDB() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Database connected successfully');
    return client.db();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('💡 Make sure to:');
    console.log('   1. Create a .env file in the root directory');
    console.log('   2. Add your MongoDB URI in MONGODB_URI variable');
    process.exit(1);
  }
}

module.exports = connectDB;
