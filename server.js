const express = require("express")
const authRoutes = require("./routes/auth")
const skillRoutes = require("./routes/skills")
const bookingRoutes = require("./routes/bookings")
const userRoutes = require("./routes/user")
const fs = require("fs")
const path = require("path")
const cors = require("cors")
const dotenv = require("dotenv")
const app = express()
app.use(express.json())
app.use(cors())
dotenv.config()

const { exportDb } = require("./db/database")

const loadSchema = async () => {
    try {
        const db = await exportDb()
        const schema = fs.readFileSync(path.join(__dirname, "models/schema.sql"), "utf-8")
        await db.query(schema)
        console.log("Schema initiated")
        app.listen(process.env.PORT || 5000, () => console.log(`Server is active on port ${process.env.PORT}`))
    } catch (err) {
        console.error("schema Error: ", err);
    }

}

loadSchema()

app.use("/api/auth", authRoutes)
app.use("/api/skills", skillRoutes)
app.use("/api/bookings", bookingRoutes) 
app.use("/api/users", userRoutes)


app.get('/', (request, response) => {
    response.status(200).send(`Skill Bridge is Active`)
})