const mongoose = require("mongoose")
require("dotenv").config()

const dblink = process.env.dblink

mongoose.connect(dblink).then(()=>{
    console.log("database connected successfully");
    
}).catch((error)=>{
   error.message
})