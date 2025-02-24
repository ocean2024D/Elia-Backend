const mongoose = require("mongoose");

const DutyExchangeSchema = new mongoose.Schema(
  {
    duty_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Duty",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"], //enum only these 3 VALUES CAN BE USED
      default: "pending",
    },

    requestingUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    acceptingUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    Days: [
      {
        date: { type: Date },
        requestStartTime: { type: Date },
        requestEndTime: { type: Date },
        assignedUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        reasonOfChange: {
          type: String,
          enum: ["sick", "vacation", "others"],
        },
      },
    ],
    reasonOfExChange: {
      type: String,
      enum: ["sick", "vacation", "others"],
    },
  },
  { collection: "dutiesExchange", timestamps: true }
);

module.exports = mongoose.model("DutyExchange", DutyExchangeSchema);
