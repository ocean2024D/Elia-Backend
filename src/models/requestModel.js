const mongoose = require("mongoose")

const DutyExchangeSchema = new mongoose.Schema({
    duty_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Duty' 
    },
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
    Days: [
      {
        date: { type: Date },
        requestStartTime : {type : Date },
        requestEndTime : {type : Date},
        assignedUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        reasonOfChange:{
          type: String,
          enum: ["sick","vacation","others"], 
        }
      
      },
    ],
    reasonOfExChange:{
      type: String,
      enum: ["sick","vacation","others"], 
    },
    // exchangeDetails: [
    //   {
    //     requestingUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //     acceptingUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //     exchangeStart: { type: Date },
    //     exchangeEnd: { type: Date }
    //   }
    // ]
}, {collection: "dutiesExchange", timestamps: true,versionKey: false})

module.exports = mongoose.model('DutyExchange', DutyExchangeSchema);