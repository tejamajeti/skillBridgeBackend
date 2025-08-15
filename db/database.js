require("dotenv").config()

const { Pool } = require("pg")

let db = null


const initializeAndStartDb = async () => {
    try {
        db = new Pool({
            connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production'
                ? { rejectUnauthorized: false }
                : false
        }

        )
        console.log("Connected to Database Successfully!!!")
    } catch (dbError) {
        console.error(dbError)
        throw dbError
    }
}

initializeAndStartDb()


exports.exportDb = async () => {
    if (!db) await initializeAndStartDb()
    return db
}