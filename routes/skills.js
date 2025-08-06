const express = require("express")
const router = express.Router()
const { createSkill, getAllSkills, getMySkills, removeSkill } = require("../controllers/skillController")
const middlewareFunction = require("../middleware/authMiddleware")


router.post("/", middlewareFunction, createSkill)
router.get("/", getAllSkills)
router.get("/my-skills", middlewareFunction, getMySkills)
router.delete("/remove/:id", middlewareFunction, removeSkill)

module.exports = router