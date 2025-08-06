const { exportDb } = require("../db/database")

exports.bookSkill = async (request, response) => {
    const { skill_id, message } = request.body
    const learner = request.user

    if (learner.role !== "learner") return response.status(403).send("You cannot book skill as a mentor")



    try {
        const db = await exportDb()

        const dbResponse = await db.query(`SELECT * FROM skills WHERE id = $1`, [skill_id])

        const skill = dbResponse.rows[0]

        if (!skill) return response.status(400).send("Skill Not Found")

        const existingBookingResponse = await db.query(`SELECT * FROM bookings WHERE skill_id = $1 AND learner_id = $2 `, [skill_id, learner.id])

        const existingBooking = existingBookingResponse.rows[0]

        if (existingBooking) return response.status(403).send(`Booking for this skill already exists!!`)

        await db.query(`INSERT INTO bookings (skill_id,learner_id,message) VALUES ($1,$2,$3) RETURNING *;`, [skill_id, learner.id, message || ""])

        return response.status(201).send("Request Sent Successfully")
    } catch (err) {
        response.status(500).send("Failed to send Request")
        
        console.error(`booking skill error ${err}`)
    }
}


exports.getMyBookings = async (request, response) => {
    const learner = request.user

    const db = await exportDb()

    try {
        if (learner.role !== "learner") return response.status(403).send("Access Denied")

        const bookings = await db.query(`SELECT b.*,s.title,s.description,u.name AS mentor_name,s.image_url FROM bookings b INNER JOIN skills s ON b.skill_id = s.id INNER JOIN users u ON s.mentor_id = u.id WHERE learner_id = $1 ORDER BY b.created_at DESC;`, [learner.id])

        response.status(200).json(bookings.rows)
    } catch (err) {
        response.status(500).send("Failed to get Bookings")
    }

}

exports.getReceivedBookings = async (request, response) => {
    const mentor = request.user

    if (mentor.role !== "mentor") return response.status(403).send("Access Denied")

    try {
        const db = await exportDb()

        const bookings = await db.query(`SELECT b.*, s.title AS skill_title,u.name AS learner_name FROM bookings b INNER JOIN skills s ON b.skill_id = s.id INNER JOIN users u ON u.id = b.learner_id WHERE s.mentor_id = $1 ORDER BY b.created_at DESC;`, [mentor.id])

        response.status(200).json(bookings.rows)
    } catch (err) {
        response.status(500).send("Failed to fetch received Bookings")
    }
}

exports.updateBookingStatus = async (request, response) => {
    const mentor = request.user
    const { booking_id } = request.params
    const { status } = request.body

    if (mentor.role !== "mentor") return response.status(403).send("Only Mentors can update booking status!!")


    if (!['accepted', 'rejected'].includes(status)) return response.status(400).send("Invalid status.")


    try {
        const db = await exportDb()

        const booking = await db.query(`SELECT b.*,s.mentor_id FROM bookings b INNER JOIN skills s ON b.skill_id = s.id WHERE b.id = $1;`, [booking_id]).rows

        if (!booking || booking.mentor_id !== mentor.id) return response.status.send(403).send(`Booking Not Found or unAuthorized`)

        await db.query(`UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *;`, [status, booking_id])

        response.status(200).send("Booking status Updated")
    } catch (err) {
        response.status(500).send(`Failed to Update status `)
    }
}

exports.deleteBookings = async (request, response) => {
    const { booking_id } = request.params

    try {
        const db = await exportDb()
        const bookingResponse = await db.query(`SELECT * FROM bookings WHERE id = $1`, [booking_id])

        const booking = bookingResponse.rows[0]


        if (!booking) return response.status(404).send("Booking doesn't Exist")

        await db.query(`DELETE FROM bookings WHERE id = $1 RETURNING *`, [booking_id])

        return response.status(200).send(`Booking Deleted Succeesfully`)
    } catch (err) {
        response.status(500).send("Failed to delete Booking")
    }

}
