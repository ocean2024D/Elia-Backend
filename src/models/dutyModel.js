const mongoose = require("mongoose")

const DutySchema = new mongoose.Schema({
   startDate: Date,
   
   endDate:Date,

    startTime: String, 

    endTime: String,

    zone : {
        type: String,
    },
    status: {
        type: String,
        enum: ["working", "sick", "on-leave"],
        default : "working"
    },
  
/*   week: {
        type: Number
    },  */ // Nico a dit que ce n'était pas nécessaire car il y a déjà la date

    assignedUser: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    },

}, {collection: "duties", timestamps: true})

module.exports = mongoose.model('Duty', DutySchema);