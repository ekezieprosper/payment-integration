const userModel = require("../models/userModel")
const adminModel = require("../models/adminModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const authenticate = async (req, res, next) => {
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

    let decodedToken
    try {
      decodedToken = jwt.verify(token, process.env.JWT_KEY)
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          error: "Session expired.... sign in to continue.",
        })
      } else if (error.name === "JsonWebTokenError") {
        return res.status(400).json({
          error: "Invalid token.",
        })
      } else if (error.name === "NotBeforeError") {
        return res.status(400).json({
          error: "Token not active.",
        })
      } else {
        return res.status(400).json({
          error: "Token verification failed.",
        })
      }
    }

    const user = await userModel.findById(decodedToken.userId)
    if (!user) {
      return res.status(404).json({
        error: "Unauthorized.",
      })
    }

    const admin = await adminModel.findOne({ suspended: user._id })
    if (admin) {
      return res.status(403).json({
        message: "This account has been suspended.",
      })
    }

    req.user = decodedToken
    next()
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
}

module.exports = authenticate