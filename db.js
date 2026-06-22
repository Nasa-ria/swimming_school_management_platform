const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URI ;
const dbName = process.env.MONGO_DB ;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let dbInstance = null;

async function getDb() {
  if (dbInstance) return dbInstance;
  try {
    await client.connect();
    dbInstance = client.db(dbName);
    console.log(`✅ MongoDB connected to ${uri}/${dbName}`);
    return dbInstance;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('💡 Ensure MongoDB is running and the URI is correct');
    throw err;
  }
}

module.exports = { getDb, client };
