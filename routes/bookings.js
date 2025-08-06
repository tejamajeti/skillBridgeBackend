const express = require("express")
const middlewareFunction = require("../middleware/authMiddleware")
const router = express.Router()
const { bookSkill, getMyBookings, getReceivedBookings, updateBookingStatus, deleteBookings } = require("../controllers/bookingController")

router.post("/", middlewareFunction, bookSkill)
router.delete("/remove/:booking_id", deleteBookings)
router.get("/my-requests", middlewareFunction, getMyBookings)
router.get("/received", middlewareFunction, getReceivedBookings)
router.patch("/:booking_id", middlewareFunction, updateBookingStatus);


module.exports = router