import dotenv from "dotenv";
dotenv.config();
import { drizzle } from "drizzle-orm/neon-http";
import pg from "pg";

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export default db;