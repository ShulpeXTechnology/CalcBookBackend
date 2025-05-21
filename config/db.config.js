const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
// require("dotenv").config();

dotenv.config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 30000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const connections = await connection.getConnection();
    console.log("✅ Connected to MySQL database");
    connections.release();
  } catch (err) {
    console.error("❌ Failed to connect to MySQL:", err.message);
  }
})();

module.exports = connection;

// const mysql = require("mysql2");
// const dotenv = require("dotenv");
// dotenv.config();

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// connection.connect((err) => {
//   if (err) {
//     console.error("Database connection failed:", err.stack);
//     return;
//   }
//   console.log("Connected to MySQL ");
// });

// module.exports = connection;
