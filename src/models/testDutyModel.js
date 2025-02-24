const mongoose = require("mongoose");

const TestDutySchedule = new mongoose.Schema(
  {
    weekNumber: { type: Number },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    username: { type: String },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    zone: { type: String, required: true },
    days: [
      {
        date: { type: Date, required: true },
        startTime: { type: Date, required: false },
        endTime: { type: Date, required: false },
        assignedUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["guard", "sick", "vacation", "others"],
          default: "guard",
        },
      },
    ],
  },
  { collection: "testDutySchedule", timestamps: true, versionKey: false }
);

module.exports = mongoose.model("TestDutySchedule", TestDutySchedule);
