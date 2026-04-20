const mysql = require("mysql2/promise");

const sslMode = (process.env.DB_SSL_MODE || "").toUpperCase();
const sslEnabled =
  process.env.DB_SSL === "true" || sslMode === "REQUIRED";

const sslConfig = sslEnabled
  ? {
      ...(process.env.DB_SSL_CA
        ? { ca: process.env.DB_SSL_CA.replace(/\\n/gm, "\n") }
        : {}),
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false"
    }
  : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: sslConfig
});

module.exports = pool;
