const mongoose = require("mongoose")

const DutySchema = new mongoose.Schema({
    
  startWeek: {
      type: Date,
  
    },
    endWeek: {
      type: Date,
  
    },
    dailyShifts: [
      {
        date: {
          type: Date,
  
        },
        startTime : {
          type:Date,

        },
        endTime: {
          type: Date
        },
  
        assignedUser: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'User' },

          status: {
            type: String,
      enum: ["garde","working","sick","vacation","others"], 
      default : "garde"
        },
      }
  
    ],

    zone : {
        type: String,
    },
  
/*   week: {
        type: Number
    },  */ // Nico a dit que ce n'était pas nécessaire car il y a déjà la date

    assignedUser: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    },

}, {collection: "duties", timestamps: true})

module.exports = mongoose.model('Duty', DutySchema);