const mongoose = require("mongoose")

const DutySchema = new mongoose.Schema({
    date: Date, 

    startTime: String, 

    endTime: String,

    zone : {
        type: String,
    },

    week: {
        type: Number
    }, 

    assignedUser: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }, 

    isPartial: { type: Boolean, default: false }, // Si la garde est partielle  // --> ChatGPT

    parentShift: { type: mongoose.Schema.Types.ObjectId, ref: 'DutyShift' }, // Pour relier à la garde d'origine si c'est un split --> ChatGPT
    
    status: { 
        type: String, enum: ['scheduled', 'pending_swap', 'swapped'], default: 'scheduled' // --> ChatGPT
    }
    
}, {collection: "duties", timestamps: true})

module.exports = mongoose.model('Duty', DutySchema);