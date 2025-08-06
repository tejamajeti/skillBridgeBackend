const { exportDb } = require("../db/database")

exports.createSkill = async (request, response) => {
    const { title, description, tags, imageUrl } = request.body
    const mentor = request.user

    if (mentor.role !== "mentor") return response.status(403).send(`Inappropriate Action. Only Mentors Can Create Skills`)

    if (!title) return response.status(400).send("Title Must be Provided")

    try {
        const db = await exportDb()
        await db.query(`INSERT INTO skills (mentor_id,title,description,tags,image_url) VALUES ($1,$2,$3,$4,$5) RETURNING *;`, [mentor.id, title, description || "", tags || "", imageUrl])
        response.status(201).send("Skill Created Successfully!!!")
    } catch (error) {
        console.log(error.message)
        response.status(500).send('Failed to Create Skill')
    }
}

exports.getAllSkills = async (request, response) => {
    try {
        const db = await exportDb();
        const skills = await db.query(`SELECT skills.*,users.name AS mentor_name,users.email AS mentor_email FROM skills INNER JOIN users ON skills.mentor_id = users.id ORDER BY skills.created_at DESC;`)
        response.status(200).json(skills.rows)
    } catch (err) {
        console.error(`Failed to fetch All Skills ${err.message}`)
        response.status(500).send(`Failed to fetch Skills`)
    }
}

exports.getMySkills = async (request, response) => {
    const mentor = request.user;

    if (mentor.role !== "mentor") return response.status(400).send(`Inappropriate action. This action can only be done by Mentors`)

    try {
        const db = await exportDb();
        const skills = await db.query(`SELECT * FROM skills WHERE mentor_id = $1 ORDER BY created_at DESC;`, [mentor.id])
        response.status(200).json(skills.rows)
    } catch (err) {
        response.status(500).send("Failed to fetch Skills")
    }
}

exports.removeSkill = async (request, response) => {
    const mentor = request.user
    const {id} = request.params

    if (mentor.role !== "mentor") return response.status(401).send("Not Allowed Action to Learners")

    try {
        const db = await exportDb()
        await db.query("DELETE FROM skills WHERE id = $1 RETURNING *", [id])
        return response.status(200).send("Skill deleted Successfully")
    } catch (err) {
        response.status(500).send("Failed to delete Skill")
        console.error(err.message)
    }
}