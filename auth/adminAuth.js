const adminModel = require("../models/adminModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const adminAuth = async (req, res, next) => {
  try {
    const hasAuthorization = req.headers.authorization

    if (!hasAuthorization) {
      return res.status(401).json({
        error: "Authorization header not found",
      })
    }

    const token = hasAuthorization.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        error: "Token not found",
      })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY, (error,payload)=>{
            if(error){
              return error
            }
            return payload
        });

        if(decodedToken.name === "TokenExpiredError"){
            return res.status(400).json({
                error:"session expired.... login to continue"
            })
        }else if(decodedToken.name === "JsonWebTokenError"){
            return res.status(400).json({
                error:"Invalid Token"
            })
        }else if(decodedToken.name === "NotBeforeError"){
            return res.status(400).json({
                error:"Token not active"
            })
        }

    const admin = await adminModel.findById(decodedToken.adminId)
    if (!admin) {
      return res.status(404).json({
        error: "Unauthorized",
      })
    }   

    req.admin = decodedToken
    next()
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
}

module.exports = adminAuth