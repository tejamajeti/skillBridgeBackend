require("dotenv").config()

const { Pool } = require("pg")

let db = null


const initializeAndStartDb = async () => {
    try {
        db = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { require: true, rejectUnauthorized: false },
            max: 15,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
        })
    } catch (dbError) {
        console.error(dbError.message)
        // throw dbError
    }
}
initializeAndStartDb()

db.on("error", (err) => {
    console.error("DB pool error:", err.code, err.message);

    if (["XX000", "57P01", "57P02", "57P03", "08006"].includes(err.code)) {
        console.warn("Database connection was terminated by Supabase. The pool will auto-recover on next query.");
        initializeAndStartDb()
    }
});


module.exports = db