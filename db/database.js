require("dotenv").config();
const { Pool } = require("pg");

let db = null;

function createPool() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { require: true, rejectUnauthorized: false },
        max: 15,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
    });

    pool.on("error", (err) => {
        console.error("DB pool error:", err.code, err.message);

        if (["XX000", "57P01", "57P02", "57P03", "08006"].includes(err.code)) {
            console.warn("Database connection terminated by Supabase. Reconnecting...");
            recreatePool();
        }
    });

    return pool;
}

function recreatePool() {
    if (db) {
        db.end().catch(() => { });
    }
    db = createPool();
}

db = createPool();

module.exports = db;

