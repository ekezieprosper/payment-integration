const mongoose = require ("mongoose")
const dateOptions = { 
    timeZone: 'Africa/Lagos', 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  }
const createdOn = new Date().toLocaleDateString('en-NG', dateOptions)


const adminSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },

    profileImg:{
        type: String,
        default: "https://i.pinimg.com/564x/4b/f4/22/4bf422a3d7b47265fee47d74fd3ed55d.jpg"
    },

    password: {
        type: String, required: true
    },

    pin: {
        type: String
    },

    admin: { 
        type: Boolean,
        default: true
    },

    treasury: { 
        type: mongoose.Schema.Types.ObjectId, 
      ref: 'treasury'
  },

    suspended: [{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'users'
    }],

    
    createdAt: {
        type: String, 
        default: createdOn
    },

})

const adminModel = mongoose.model("admins", adminSchema)

module.exports = adminModel