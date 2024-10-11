const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const resetFunc = (name, verificationLink, otp, email) => {
    const safeName = escapeHtml(name);
    const safeVerificationLink = escapeHtml(verificationLink);
    const safeEmail = escapeHtml(email);
    const safeOtp = escapeHtml(otp);
    const currentYear = new Date().getFullYear();

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - PaySphere</title>
        <style>
            body {
                Margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                font-family: Arial, sans-serif;
                font-size: 16px;
                color: #333333;
            }
            table {
                border-collapse: collapse;
            }
            a {
                text-decoration: none;
            }

            /* Responsive styling for small screens */
            @media only screen and (max-width: 600px) {
                body {
                    font-size: 14px;
                }
                td {
                    font-size: 14px;
                }
                a {
                    font-size: 14px;
                }
                .otp {
                    font-size: 16px;
                }
            }
        </style>
    </head>
    <body>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td style="padding:20px 0 20px 0;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse;">
                        <!-- Email Header -->
                        <tr>
                            <td align="center" bgcolor="#0077BE" style="padding: 20px; color: white; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold;">
                                Password Reset Request
                            </td>
                        </tr>
                        <!-- Email Body -->
                        <tr>
                            <td bgcolor="#ffffff" style="padding: 20px; font-family: Arial, sans-serif; font-size: 16px; color: #333333;">
                                <p>Hello <b>${safeName}</b>,</p>
                                <p>We received a request to reset your account password.</p>
                                <p>Use the OTP code below to reset your password. Please do not share this code with anyone. The code will expire in 10 minutes:</p>
                                <p style="text-align: center; font-size: 18px; letter-spacing: 3px; font-weight: bold;" class="otp">${safeOtp}</p>
                                <p>If you'd prefer, you can reset your password by clicking the button below:</p>
                                <p style="text-align: center;">
                                    <a href="${safeVerificationLink}" style="
                                        display: inline-block;
                                        padding: 12px 24px;
                                        margin: 20px 0;
                                        background-color: #0077BE;
                                        color: #ffffff;
                                        text-decoration: none;
                                        border-radius: 4px;
                                        font-weight: bold;
                                        font-family: Arial, sans-serif;
                                        font-size: 16px;
                                    ">Reset Password</a>
                                </p>
                                <p>If you did not request this, please ignore this email.</p>
                            </td>
                        </tr>
                        <!-- Email Footer -->
                        <tr>
                            <td bgcolor="#f4f4f4" style="padding: 20px; text-align: center; font-family: Arial, sans-serif; font-size: 12px; color: #777777;">
                                <p>© ${currentYear} PaySphere.ltd, 203 Muyibi Road</p>
                                <p>This message was sent to <a href="mailto:${safeEmail}" style="color: #0077BE;">${safeEmail}</a>. Please ignore if you didn't request a password reset.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

module.exports = { resetFunc }