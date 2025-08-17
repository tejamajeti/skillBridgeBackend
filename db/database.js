require("dotenv").config()

const { Pool } = require("pg")

let db = null


const initializeAndStartDb = async () => {
    try {
        db = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { require: true, rejectUnauthorized: false },
            max: 5,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
        })
    } catch (dbError) {
        console.error(dbError.message)
        // throw dbError
    }
}
initializeAndStartDb()

module.exports = db