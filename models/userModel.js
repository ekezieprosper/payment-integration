const mongoose = require("mongoose") 

const userSchema = new mongoose.Schema({

    firstName:{
        type: String,
    },

    lastName:{
        type: String,
    },

    email:{
        type: String
    },

    phoneNumber:{
        type: String,
    },

    walletId: {
        type: String,
    },

    profileImg: {
        type: String,
        default: "https://i.pinimg.com/564x/76/f3/f3/76f3f3007969fd3b6db21c744e1ef289.jpg"
    },

    password: {
        type: String,
    },

    pin: {
        type: String,
    },

    acctBalance:{
        type: Number,
        default: 0
    },

    verified:{
        type: Boolean,
        default: false
    },

    BankDetails:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "BankDetails"
    }],

})

const userModel = mongoose.model("users", userSchema)
module.exports = userModel