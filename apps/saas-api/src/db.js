import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn("WARNING: DATABASE_URL is not set in environment variables.");
}

const isLocalDb =
  !process.env.DATABASE_URL ||
  process.env.DATABASE_URL.includes("localhost") ||
  process.env.DATABASE_URL.includes("127.0.0.1");

// Allow explicit override via DB_SSL_REJECT_UNAUTHORIZED if using custom/self-signed certificates
const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false";

if (!rejectUnauthorized) {
  console.warn(
    "SECURITY WARNING: Database TLS certificate verification is disabled (rejectUnauthorized: false).",
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocalDb
    ? false
    : {
        rejectUnauthorized,
      },
});

export const query = (text, params) => pool.query(text, params);

export default pool;
