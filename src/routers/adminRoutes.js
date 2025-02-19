const express = require("express");
const router = express.Router();


const {createTestSchedule  } = require("../controllers/adminController"); 


router.post("/adminCreateSchedule", createTestSchedule);

module.exports = router;