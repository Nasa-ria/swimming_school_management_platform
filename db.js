const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'swimming_school',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promisify for async/await
const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('💡 Make sure to:');
    console.log('   1. Create a .env file in the root directory');
    console.log('   2. Add your database credentials');
    console.log('   3. Run the schema.sql file to create tables\n');
  } else {
    console.log('✅ Database connected successfully');
    connection.release();
  }
});

module.exports = promisePool;

