const TestDuty = require("../models/testDutyModel");
const User = require("../models/userModel");

const createTestSchedule = async (req, res) => {
  try {
    const { zone, weeks } = req.body;

    if (!zone || !Array.isArray(weeks) || weeks.length === 0) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const users = await User.find({ zone });

    if (users.length < 6) {
      return res.status(400).json({ message: "At least 6 users are required for the zone." });
    }

    let previousEndDate = null;

    // générer les jours d'une semaine
    const generateDays = (startDate, assignedUser, username) => {
        let days = [];
        for (let i = 0; i < 7; i++) {
          let day = new Date(startDate);
          day.setDate(startDate.getDate() + i); 
      
          days.push({
            date: day.toISOString(),
            assignedUser,
            username,
            status: "guard",
          });
        }
        return days;
      };
      
      const duties = [];
      
      for (const week of weeks) {
        const { weekNumber, assignedUser, startDate } = week;
      
        let dutyStart = new Date(startDate);
        while (dutyStart.getDay() !== 4) {
          dutyStart.setDate(dutyStart.getDate() + 1); // Trouver le jeudi
        }
        dutyStart.setHours(7, 30, 0, 0);
      
        let dutyEnd = new Date(dutyStart);
        dutyEnd.setDate(dutyStart.getDate() + 7);
      
        previousEndDate = dutyEnd;
      
        const user = users.find((u) => u._id.toString() === assignedUser);
        const username = user ? user.name : "Unknown";
      
        duties.push({
          weekNumber,
          assignedUser,
          username,
          startDate: dutyStart.toISOString(),
          endDate: dutyEnd.toISOString(),
          zone,
          days: generateDays(dutyStart, assignedUser, username),
        });
      }
      
      await TestDuty.insertMany(duties);
      

    // Génération automatique des semaines restantes
    for (let i = weeks[weeks.length - 1].weekNumber; i < 52; i++) {
      const user = users[i % users.length];

      let dutyStart = new Date(previousEndDate);
      dutyStart.setDate(dutyStart.getDate() + ((4 - dutyStart.getDay() + 7) % 7));
      dutyStart.setHours(7, 30, 0, 0);

      let dutyEnd = new Date(dutyStart);
      dutyEnd.setDate(dutyStart.getDate() + 7);

      previousEndDate = dutyEnd;

      await TestDuty.create({
        weekNumber: i + 1,
        assignedUser: user._id,
        username: user.name,
        startDate: dutyStart.toISOString(),
        endDate: dutyEnd.toISOString(),
        zone,
        days: generateDays(dutyStart, user._id, user.name),
      });
    }

    res.status(201).json({ message: "Test duties added successfully." });
  } catch (error) {
    console.error("Error adding duties:", error);
    res.status(500).json({ message: "Error adding duties" });
  }
};

module.exports = { createTestSchedule };
