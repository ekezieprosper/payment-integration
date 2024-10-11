const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        expires: '10m'
    },

    userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true
    }],

})

const OTPModel = mongoose.model('OTP', otpSchema)

module.exports = OTPModel
