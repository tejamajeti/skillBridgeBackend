const express = require("express")

const router = express.Router()

const { getMyProfile, updateProfile } = require("../controllers/userController")

const middlewareFunction = require("../middleware/authMiddleware")

router.get("/", middlewareFunction, getMyProfile)

router.put("/", middlewareFunction, updateProfile)

module.exports = router