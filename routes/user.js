const express = require("express")

const router = express.Router()

const { getMyProfile, updateProfile, resetPassword } = require("../controllers/userController")

const middlewareFunction = require("../middleware/authMiddleware")

router.get("/", middlewareFunction, getMyProfile)

router.put("/", middlewareFunction, updateProfile)

router.patch("/reset", resetPassword)

module.exports = router