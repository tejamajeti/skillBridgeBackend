
const { exportDb } = require("../db/database")

exports.getMyProfile = async (request, response) => {
    const user = request.user
    const { password, ...safeUser } = user

    response.status(200).json(safeUser)
}

exports.updateProfile = async (request, response) => {
    const { name, bio } = request.body
    console.log(name)
    console.log(bio)
    const user = request.user

    try {
        const db = await exportDb()

        await db.query(`UPDATE users SET name = $1,bio = $2 WHERE id = $3 RETURNING *;`, [name, bio, user.id])
        response.status(200).send('Profile Updated')
    } catch (err) {
        response.status(500).send('Failed to update Profile')
        console.error(err.message)
    }
}