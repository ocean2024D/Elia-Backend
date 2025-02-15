const { number } = require("joi");
const mongoose = require("mongoose");

const DutySchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["guard", "working", "sick", "vacation", "others"],
      default: "guard",
    },

    days: [
      {
        date: { type: Date, required: true },
        startTime: { type: Date, required: false },
        endTime: { type: Date, required: false },

        assignedUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },

        exchangeDetails: {
          acceptingUser: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
          exchangeStart: { type: Date },
          exchangeEnd: { type: Date },
        },
        status: {
          type: String,
          enum: ["guard", "working", "sick", "vacation", "others"],
          default: "guard",
        },
      },
    ],
  },
  { collection: "duties", timestamps: true }
);

module.exports = mongoose.model("Duty", DutySchema);
