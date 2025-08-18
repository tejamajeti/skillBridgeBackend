
const db = require("../db/database")

const bcrypt = require("bcrypt")

exports.getMyProfile = async (request, response) => {
    const user = request.user
    const { password, ...safeUser } = user

    response.status(200).json(safeUser)
}

exports.updateProfile = async (request, response) => {
    const { name, bio } = request.body
    const user = request.user

    try {

        await db.query(`UPDATE users SET name = $1,bio = $2 WHERE id = $3 RETURNING *;`, [name, bio, user.id])
        response.status(200).send('Profile Updated')
    } catch (err) {
        response.status(500).send('Failed to update Profile')
    }
}

exports.resetPassword = async (request, response) => {
    const { new_password, email } = request.body

    try {

        if (!new_password) return response.status(400).send("Password Required!!!")

        const dbResponse = await db.query(`SELECT * FROM users WHERE email = $1`, [email])

        const user = dbResponse.rows[0]

        const isExistingPassword = await bcrypt.compare(user.password, new_password)


        if (isExistingPassword) return response.status(400).send("New password cannot be same as old one")

        const hashedPassword = await bcrypt.hash(new_password, 10)

        await db.query(`UPDATE users SET password = $1 WHERE email = $2 RETURNING *`, [hashedPassword, email])

        return response.status(201).send("Password Updated Successfully.")
    } catch (err) {
        response.status(500).send(`Failed to update Password due to ${err.message}`)
    }

}