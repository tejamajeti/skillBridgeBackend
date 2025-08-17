const jwt = require("jsonwebtoken")
const db = require("../db/database")

const middlewareFunction = async (request, response, next) => {
    try {
        const authHeaders = request.headers['authorization']
        const jwtToken = authHeaders?.split(" ")[1]
        if (!jwtToken) return response.status(403).send(`Access Denied No Token Provided`)
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY)
        const dbResult = await db.query(`SELECT * FROM users WHERE id = $1;`, [decoded.id])
        const isValidUser = dbResult.rows[0]
        if (!isValidUser) return response.status(404).send(`User Not Found`)
        request.user = isValidUser
        next();
    } catch (err) {
        response.status(403).send(err.message)
    }
}

module.exports = middlewareFunction