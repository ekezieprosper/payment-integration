const mongoose = require("mongoose") 

const bankDetailsSchema = new mongoose.Schema({

    acctName:{ 
        type: String 
    },

    acctNumber:{
        type:String 
    },

    bankCode:{ 
        type:String 
    },

    ref_code:{ 
        type:String 
    },

    users:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    }

},{timestamp:true})



const bankModel = mongoose.model("BankDetails", bankDetailsSchema)
module.exports = bankModel