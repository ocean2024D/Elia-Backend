const mongoose = require("mongoose")

const DutySchema = new mongoose.Schema({
    date: Date, 

    startTime: String, 

    endTime: String,

    zone : {
        type: String,
    },

/*     week: {
        type: Number
    },  */

    assignedUser: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    },

}, {collection: "duties", timestamps: true})

module.exports = mongoose.model('Duty', DutySchema);