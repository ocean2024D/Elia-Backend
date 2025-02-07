const mongoose = require("mongoose")

const DutyExchangeSchema = new mongoose.Schema({
    duty_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Duty' 
    },

    date: Date, 

    startTime: String, 

    endTime: String,

    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],//enum only these 3 VALUES CAN BE USED
        default: 'pending'                         
    },

    requestingUser: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'user' 
    },
    acceptingUser: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'user' 
    },
}, {collection: "dutiesExchange", timestamps: true})

module.exports = mongoose.model('DutyExchange', DutyExchangeSchema);