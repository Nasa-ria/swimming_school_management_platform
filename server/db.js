const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const localUri = 'mongodb://127.0.0.1:27017/swimming_school';
let memoryServer = null;

const buildDirectUri = (uri) => {
  if (!uri || !uri.startsWith('mongodb+srv://')) return uri;

  const match = uri.match(/mongodb\+srv:\/\/(?:[^@]+@)?([^/]+)\/(.+)$/i);
  if (!match) return uri;

  const [, host, db] = match;
  return `mongodb://${host}/${db}`;
};

const tryConnect = async (uri) => {
  const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
  console.log(`📡 Attempting to connect to: ${maskedUri}`);

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 7000,
      socketTimeoutMS: 7000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`❌ MongoDB Connection Error for ${maskedUri}:`, err.message);
    return null;
  }
};

const connectDB = async () => {
  const urisToTry = [];
  if (process.env.MONGODB_URI) urisToTry.push(process.env.MONGODB_URI);
  urisToTry.push(localUri);

  for (const uri of urisToTry) {
    const conn = await tryConnect(uri);
    if (conn) return conn;

    if (uri.startsWith('mongodb+srv://')) {
      const directUri = buildDirectUri(uri);
      if (directUri !== uri) {
        console.log(`🔁 Trying direct hostname URI: ${directUri}`);
        const directConn = await tryConnect(directUri);
        if (directConn) return directConn;
      }
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    try {
      memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri();
      console.log(`🧪 Using in-memory MongoDB at ${memoryUri}`);
      const conn = await tryConnect(memoryUri);
      if (conn) return conn;
    } catch (memoryErr) {
      console.error('❌ In-memory MongoDB fallback failed:', memoryErr.message);
    }
  }

  return null;
};

module.exports = connectDB;
