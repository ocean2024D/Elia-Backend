const mongoose = require("mongoose");
const Duty = require("../models/dutyModel");
const User = require("../models/userModel");

// Fonction pour générer un planning de gardes pour 6 semaines
const generateDutySchedule = async () => {
    try {
    const users = await User.find({});
    if (users.length < 6) {
      console.error("At least 6 users are required for a full duty cycle.");
      return;
    }

    let startDate = new Date(Date.UTC(2025, 0, 1, 7, 30, 0, 0));

    while (startDate.getUTCDay() !== 4) {
      startDate.setUTCDate(startDate.getUTCDate() + 1);
    }

    let duties = [];

    for (let i = 0; i < 52; i++) {
      const userIndex = i % 6;
      const user = users[userIndex];

      const dutyStart = new Date(
        startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000
      );
      const dutyEnd = new Date(dutyStart.getTime() + 7 * 24 * 60 * 60 * 1000);

      let days = [];
      for (let j = 0; j < 7; j++) {
        let dayDate = new Date(dutyStart);
        dayDate.setUTCDate(dutyStart.getUTCDate() + j);

        days.push({
          date: dayDate.toISOString(),
          assignedUser: user._id,
          status: "guard",
        });
      }


      duties.push({
        weekNumber: i + 1,
        startDate: dutyStart.toISOString(),
        endDate: dutyEnd.toISOString(),
        assignedUser: user._id,
        status: "guard",
        zone: user.zone || "Default Zone",
        username: user.name || "Unknown",
        days: days, 
      });
    }

    await Duty.insertMany(duties);
    console.log("Duty schedule successfully generated with day names!");
  } catch (error) {
    console.error("Error generating the schedule:", error);
  }
};

const initializeSchedule = async () => {
  try {
    const existingDuties = await Duty.countDocuments();
    if (existingDuties === 0) {
      console.log("No existing schedule found, creating the schedule...");
      await generateDutySchedule();
    } else {
      console.log("Schedule already exists, no action required.");
    }
  } catch (error) {
    console.error("Error initializing the schedule:", error);
  }
};


module.exports = {initializeSchedule };
