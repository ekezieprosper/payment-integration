const unSuspendMail = require("../Emails/unSuspendEmail");
const sendEmail = require("../Emails/email");


const sendUnSuspendedMail = async (user) => {
    try {

        if (!user) throw new Error("user not found")

        // Prepare email content
        const subject = `Your account has been restored`
        const name = user.firstName
        const email = user.email
        const logIn = `https://paysphere.vercel.app/login`
        const supportTeam = `elitefootball234@gmail.com`

        const html = unSuspendMail(name, logIn, supportTeam, email)

        await sendEmail({ email, subject, html, text: subject }) 
    } catch (error) {
        console.error( error.message)
    }
}

module.exports = sendUnSuspendedMail