const mongoose = require("mongoose")

const DutySchema = new mongoose.Schema({
    
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  zone : { type: String, required: true },
  days: [
    {
        date: { type: Date, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },

        assignedUser: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        },

        status: {
            type: String,
            enum: ["garde", "working", "sick", "vacation", "others"], 
            default: "garde"
        },
    }
],
}, {collection: "duties", timestamps: true})

module.exports = mongoose.model('Duty', DutySchema);