const router = require("express").Router()
const { duty } = require("../controllers/autController")

router.post("/duty", duty)

