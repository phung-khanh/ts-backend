import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, NODE_ENV } =
  process.env;

if (!DB_USER || !DB_HOST || !DB_NAME || !DB_PASSWORD || !DB_PORT) {
  throw new Error("Missing database environment variables!");
}

export const database = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: Number(DB_PORT),
  ssl: NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // Cấu hình SSL tùy thuộc vào môi trường
});
