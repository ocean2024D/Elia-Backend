const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
    },
    zone: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    positiveHours: {
      type: Number,
      default: 0,
    },
    negativeHours: {
      type: Number,
      default: 0,
    },
  },
  { collection: "users", timestamps: true }
);



// module.exports = User;

const user = mongoose.model("user", userSchema)

module.exports = user // ca fait crash si il est grand letter (User)
