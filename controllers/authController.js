const db = require("../db/database")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.register = async (request, response) => {
    const { name, email, password, role, bio } = request.body

    if (!name || !email || !password || !role) {
        return response.status(400).send(`All fields are required`)
    }

    try {
        const dbResult = await db.query(`SELECT * FROM users WHERE email = $1;`, [email])
        const existingUser = dbResult.rows[0]
        if (existingUser) {
            return response.status(400).send(`Email already Registered!!!`)
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            await db.query(`INSERT INTO users (name, email, password, role, bio) VALUES($1, $2, $3, $4, $5) RETURNING *;`, [name, email, hashedPassword, role, bio])
            return response.status(201).send(`User Registered Successfully.`)
        }
    } catch (error) {
        return response.status(500).send(`Registration Failed: ${error}`)
    }
}

exports.login = async (request, response) => {
    const { email, password } = request.body
    try {
        const dbResult = await db.query(`SELECT * FROM users WHERE email = $1;`, [email])
        const isExistingUser = dbResult.rows[0]
        if (!isExistingUser) return response.status(401).send(`User Not Found`)
        const isValidPassword = await bcrypt.compare(password, isExistingUser.password)
        if (!isValidPassword) return response.status(401).send(`Invalid Credentials`)
        const jwtToken = jwt.sign({ id: isExistingUser.id, role: isExistingUser.role }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })
        response.status(200).json({ message: `Login Successful`, jwt_token: jwtToken, user: { id: isExistingUser.id, name: isExistingUser.name, email: isExistingUser.email, bio: isExistingUser.bio, role: isExistingUser.role } })
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

exports.verifyEmail = async (request, response) => {
    const { email } = request.body
    try {
        const dbResponse = await db.query(`SELECT * FROM users WHERE email = $1`, [email])
        if (!dbResponse.rows[0]) return response.status(401).send("Email not found")
        return response.status(200).send("valid User")
    } catch (err) {
        response.status(500).send("Failed to Validate user email")
    }
}