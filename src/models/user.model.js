const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name : {
        type : String, 
        required: true, 
        trim: true
    }, 
    password : {
        type : String, 
        required: true, 
        trim: true
    },
    isAdmin : {
        type: Boolean,
    },
    zone : {
        type: String,
    },
    isOnDuty: {Boolean},
        lastname : {
        type : String, 
        required: true, 
        trim: true
    },  
    email : {
        type : String, 
        required: true, 
        trim: true, 
        unique : true
    },  
}, {collection: "users", timestamps: true})

const user = mongoose.model("user", userSchema)

module.exports = user