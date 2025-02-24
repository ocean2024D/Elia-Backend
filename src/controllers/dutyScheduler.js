const mongoose = require("mongoose");
const Duty = require("../models/dutyModel");
const user = require("../models/userModel");

const generateDutySchedule = async () => {
  try {
    //grouping the users

    const usersByZone = await User.aggregate([
      {
        $group: {
          _id: "$zone",
          users: { $push: { _id: "$_id", name: "$name" } },
        },
      },
    ]);

    if (usersByZone.length === 0) {
      console.error("any user found.");
      return;
    }

    let startDate = new Date(Date.UTC(2025, 0, 1, 7, 30, 0, 0));

    while (startDate.getUTCDay() !== 4) {
      startDate.setUTCDate(startDate.getUTCDate() + 1);
    }

    let allDuties = [];

    // for every zone a new cycle
    for (const zoneData of usersByZone) {
      const { _id: zone, users } = zoneData;

      if (users.length < 6) {
        console.warn(`Zone ${zone} at least 6 user required`);
        continue;
      }

      for (let i = 0; i < 52; i++) {
        const userIndex = i % users.length;
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
            username: user.name,
            status: "guard",
          });
        }

        allDuties.push({
          weekNumber: i + 1,
          startDate: dutyStart.toISOString(),
          endDate: dutyEnd.toISOString(),
          assignedUser: user._id,
          username: user.name,
          status: "guard",
          zone: zone || "Default Zone",
          days: days,
        });
      }
    }

    await Duty.insertMany(allDuties);
    console.log("successfully generated the schedule");
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

module.exports = { initializeSchedule };
