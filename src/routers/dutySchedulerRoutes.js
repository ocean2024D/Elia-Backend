const express = require("express");
const {
  initializeSchedule,
} = require("../controllers/dutyScheduler");

const router = express.Router();

router.post("/initialize", async (req, res) => {
  try {
    await initializeSchedule();
    res.status(200).json({ message: "Schedule initialized successfully!" });
  } catch (error) {
    console.error("Error during initialization:", error);
    res
      .status(500)
      .json({ message: "Error initializing schedule", error: error.message });
  }
});



module.exports = router;
