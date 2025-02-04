const router = require("express").Router()
const { login, register, me } = require("../controllers/auth.controller")
const authValidation = require("../middelwares/validations/auth.validation")
const {tokenCheck} = require("../middelwares/auth")

router.post("/login", authValidation.login, login)

router.post("/register", register, authValidation.register, register)

router.get("/me", tokenCheck, me)


module.exports = router