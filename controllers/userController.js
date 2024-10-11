const userModel = require('../models/userModel.js')
const jwt = require("jsonwebtoken")
const adminModel = require("../models/adminModel")
const OTPModel = require('../models/otpModel')
const cloudinary = require("../media/cloudinary")
// const sendUniqueID = require("../Emails/userUniqueID")
// const { resetFunc } = require("../Emails/resetPasswordEmail")
const parsePhoneNumber = require('libphonenumber-js')
// const paymentModel = require('../models/paymentModel')
// const sendEmail = require("../Emails/email")
const bcrypt = require("bcrypt")
const fs = require("fs")
require("dotenv").config()



exports.signUp_user = async (req, res) =>{
    try{
    const { firstName, lastName, email, phoneNumber, password, confirmPassword } = req.body

    const userExists = await userModel.findOne({email})
    if(userExists){
        return res.status(400).json({
         message: `'${userExists.email}'[] already been used.`
        })
    }
    
    if(password != confirmPassword){
        return res.status(400).json({
        message: `Password does not match`
        })
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

     // generate a wallet id for the user
    const generatedWalletIDs = new Set()

    function generateUniqueWalletID() {
    let walletId
    do {
        walletId = String(Math.floor(Math.random() * 10000000000)).padStart(10, '0')
    } while (generatedWalletIDs.has(walletId))

        generatedWalletIDs.add(walletId)
        return walletId
 }
    const newWalletID = generateUniqueWalletID()

    const user = await userModel.create({
    firstName: firstName.toLowerCase().charAt(0).toUpperCase() + firstName.slice(1), 
    lastName: lastName.toLowerCase().charAt(0).toUpperCase() + lastName.slice(1),
    email:email.toLowerCase(),
    phoneNumber,
    walletId: newWalletID,
    password: hash,
    })
    
    res.status(201).json({
        message: `Welcome, ${user.firstName}. You have created an account successfully`,
        data: user
    })

    }catch(err){
        res.status(500).json({
            message: err.message 
        })
    }

}


exports.logIn = async (req, res) => {
    try {
    const { email, password } = req.body

    const user = await userModel.findOne({email})
    if (!user) {
        return res.status(404).json({
            message: 'User not found',
        })
    }

    // Check if the provided password is correct
    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) {
        return res.status(400).json({
        message: 'Invalid password',
        })
    }

      // Check if user has been suspended
      const admin = await adminModel.findOne({ suspended: user._id })
      if (admin) {
        return res.status(403).json({
          message: "This account has been suspended."
        })
      }
      
       // verify the user
       if (!user.verified) {
        user.verified = true
        await user.save()
      }


    // Create and sign a JWT token
    const token = jwt.sign({
        userId: user._id,
        email: user.email
    }, process.env.JWT_KEY,{ expiresIn: '7d' })

    res.status(200).json({
       message: `You've successfully logged in`,
       data: user,
       token,
    })

  } catch (err) {
    res.status(500).json({
        message: err.message,
    })
  }
}


exports.logOut = async (req, res) => {
    try {
        const hasAuthorization = req.headers.authorization

        if (!hasAuthorization) {
            return res.status(401).json({
                error: "Authorization token not found",
            })
        }

        const token = hasAuthorization.split(" ")[1]
        if (!token) {
            return res.status(401).json({
                error: "Authorization token not found",
            })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_KEY)

        const user = await userModel.findById(decodedToken.userId)
        if (!user) {
            return res.status(404).json({
                error: "User not found",
            })
        }

        const expiredToken = jwt.sign({
            userId: user._id,
            email: user.email,
        }, process.env.JWT_KEY, { expiresIn: '1sec' })

        res.status(200).json({
            message: "Logged out successfully",
            expiredToken
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


exports.getOne = async (req, res) =>{
    try{
        const userId = req.user.userId

        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({
                message: `User not found`
            })
        }

        res.status(200).json({
            data: {
                firstName:user.firstName,
                lastName:user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                wallet: user.walletId,
                Ballance:user.acctBalance
            }
        })

    }catch(err){
        res.status(500).json({
            message: err.message,
        })
    }
}


exports.createTransactionPin = async(req, res)=>{
    try {
        const id = req.user.userId
        const {pin} = req.body

        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                error: "user not found"
            })
        }

        // Encrypt the pin
       const salt = bcrypt.genSaltSync(10)
       const hashPin = bcrypt.hashSync(pin, salt)

       user.pin = hashPin
       await user.save()

       return res.status(200).json(user.pin)

    } catch (error) {
        return res.status(500).json({
            error: error.message
          })
    }
}




exports.createProfileImg = async (req, res) => {
    try {
        const id = req.user.userId

        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                error: "User not found"
            })
        }

        // Validate file upload
        const file = req.file
        if (!file || !file.path) {
            return res.status(400).json({ 
                error: "File upload is required" 
            })
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' })

        // Delete the file from local storage
        fs.unlink(file.path, (err) => {
            if (err) {
                console.error('Failed to delete local file', err)
            }
        })

        // Update user profile image URL
        user.profileImg = result.secure_url
        await user.save()

        // Send success response
        res.status(200).json({
            profileImg: user.profileImg
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}


exports.deleteProfileImg = async (req, res) => {
    try {
        const id = req.user.userId

        const user = await userModel.findById(id)
        if (user.profileImg) {
            const oldImage = user.profileImg.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(oldImage)
        }

        // Update profile image URL in the database to default
        user.profileImg = "https://i.pinimg.com/564x/76/f3/f3/76f3f3007969fd3b6db21c744e1ef289.jpg"
        await user.save()

        // Send success response
        res.status(200).json(user.profileImg)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


exports.changePassword = async (req, res) => {
    try {
        const id = req.user.userId

        const { currentPassword, newPassword, confirmPassword } = req.body

        if (!confirmPassword) {
            return res.status(400).json({
                error: "Confirm password."
            })
        }

        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                error: "User not found"
            })
        }

        const checkPassword = await bcrypt.compare(currentPassword, user.password)
        if (!checkPassword) {
            return res.status(401).json({
                error: "Incorrect password"
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                error: "Passwords do not match."
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        user.password = hashedPassword
        await user.save()

        return res.status(200).json({
            message: `new password is saved`
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


exports.forgotPassword = async (req, res) => {
    try {
        const { id } = req.params
        const { email } = req.body

        const user = await userModel.findOne({ email, _id: id })
        if (!user) {
            return res.status(404).json({ 
                error: 'User not found' 
            })
        }

        // Generate 6-digit OTP
        const otp = `${Math.floor(Math.random() * 1000000)}`.padStart(6, '0')
        
        // hash OTP then save it to the database
        const salt = await bcrypt.genSalt(10)
        const hashedOtp = await bcrypt.hash(otp, salt)

        await OTPModel.create({
            userId: user._id,
            otp: hashedOtp
        })

        // Send email with OTP and verification link
        const name = `${user.firstName.toUpperCase()}`
        const Email = user.email
        const subject = `${otp} is your account recovery code`
        const verificationLink = `https://pronext.onrender.com/reset_password/${user._id}`

        // Make sure the resetFunc receives all necessary parameters correctly
        const html = resetFunc(name, verificationLink, otp, Email)
        await sendEmail({ email, subject, html })

        return res.status(200).json({
            message: "We've sent you an email"
        })
    } catch (error) {
        return res.status(500).json({ 
            error: error.message 
        })
    }
}


exports.resendRecoveryCode = async (req, res) => {
    try {
        const id = req.params.id

        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                error: "User not found."
            })
        }

        // Generate 6-digit OTP
        const otp = `${Math.floor(Math.random() * 1000000)}`.padStart(6, '0')

        // hash OTP then save it to the database
        const saltotp = bcrypt.genSaltSync(10)
        const hashedOtp = bcrypt.hashSync(otp, saltotp)

        // Save the hashed OTP in the OTPModel for verification
        await OTPModel.create({
            userId: user._id,
            otp: hashedOtp
        })

        // Send the OTP to the user's email
        const name = `${user.firstName.toUpperCase()}. ${user.lastName.slice(0,1).toUpperCase()}`
        const Email = user.email
        const subject =`${otp} is your account recovery code`
        const verificationLink = `https://pronext.onrender.com/reset_password/${user._id}`
        const html = resetFunc(name, verificationLink, otp, Email)
        await sendEmail({ email: user.email, subject, html })

        // return success response
        return res.status(200).json({
            message: "check your email address"
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


exports.inpute_reset_code = async (req, res) => {
    try {
        const id = req.params.id
        const { otp } = req.body

        // Find the user by ID
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({ 
                error: "User not found" 
            })
        }

        const otpRecord = await OTPModel.findOne({ userId: id })
        if (!otpRecord) {
            return res.status(404).json({
                 error: "OTP has expired" 
            })
        }

        // Compare the OTP from the request with the saved OTP
        const isMatch = await bcrypt.compare(otp, otpRecord.otp)
        if (!isMatch) {
            return res.status(400).json({ 
                error: "Invalid OTP" 
            })
        }

        // Delete the OTP record after successful verification
        await OTPModel.findByIdAndDelete(otpRecord._id)

        // Redirect the user to the reset password page
        return res.status(200).json({
            message: "reset password now"
        })
    } catch (error) {
        return res.status(500).json({
             error: error.message 
        })
    }
}


exports.resetPassword = async (req, res) => {
    try {
        const id = req.params.id

        const { newPassword, confirmPassword } = req.body

        if (!confirmPassword) {
            return res.status(400).json({
                error: "Confirm your password"
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                error: "Passwords do not match"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                error: "User not found"
            })
        }

        user.password = hashedPassword
        await user.save()

        res.status(200).json({
            message: `new password is saved`
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}