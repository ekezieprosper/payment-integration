const nodemailer = require('nodemailer')
require('dotenv').config()

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
            user: process.env.USER,
            pass: process.env.MAILPASS,
        },
        secure:false
    })

    let mailOptions = {
        from: `"PaySphere" ${process.env.USER}`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.error("Error sending email:", error)
    }
}

module.exports = sendEmail