const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const DynamicEmail = (name, walletID, verificationLink, email) => {
    const safeName = escapeHtml(name);
    const safeWalletID = escapeHtml(walletID);
    const safeVerificationLink = escapeHtml(verificationLink);
    const safeEmail = escapeHtml(email);
    const currentYear = new Date().getFullYear();

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to PaySphere</title>
        <style>
            body, table, td, a {
                margin: 0;
                padding: 0;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
            table, td {
                border-collapse: collapse;
            }
            body {
                background-color: #f4f4f4;
                font-family: Arial, sans-serif;
                width: 100% !important;
                height: 100% !important;
            }
            .email-container {
                max-width: 600px;
                margin: auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
                background-color: #0077BE; /* Ocean blue */
                padding: 20px;
                border-radius: 8px 8px 0 0;
            }
            .header h1 {
                font-size: 20px;
                color: #ffffff; /* White text */
                margin-top: 0;
            }
            .content {
                font-size: 14px;
                color: #333333;
            }
            .content p {
                margin: 0 0 15px 0;
            }
            .unique-id {
                text-align: center;
                font-size: 20px;
                font-weight: bold;
                color: #28a745;
                margin: 20px 0;
            }
            .footer {
                font-size: 10px;
                color: #888888;
                text-align: center;
                margin-top: 30px;
                padding-top: 15px;
                border-top: 1px solid #e0e0e0;
            }
            .footer a {
                color: #888888;
                text-decoration: none;
            }
            .button {
                display: inline-block;
                padding: 8px 16px;
                background-color: #0077BE;
                color: white;
                text-decoration: none;
                font-size: 14px;
                border-radius: 4px;
                text-align: center;
                margin: 20px auto; /* Centering the button */
                width: fit-content; /* Makes the button take the width of its content */
            }
            /* Media Queries for mobile responsiveness */
            @media screen and (max-width: 600px) {
                .email-container {
                    width: 100% !important;
                    padding: 10px;
                }
                .content p, .footer {
                    font-size: 12px;
                }
                .header h1 {
                    font-size: 16px;
                }
                .unique-id {
                    font-size: 16px;
                }
                .button {
                    padding: 8px 16px;
                    font-size: 12px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Welcome to PaySphere</h1>
            </div>
            <div class="content">
                <h4>Hi ${safeName},</h4>
                <p>Thank you for joining PaySphere! We’re excited to have you on board. Our platform offers a variety of payment solutions designed to make transactions seamless and efficient.</p>
                <p>Your wallet ID is: <b style="font-size: 16px; color: #333;">${safeWalletID}</b>. You’ll need this ID to access your account and some other transactions.</p>
                <p>Click the button below to get started:</p>

                <p style="text-align: center;"> <a href="${safeVerificationLink}" class="button">Get started</a> </p>

            </div>
            <div class="footer">
                <p>© ${currentYear} PaySphere.ltd, 203 Muyibi Road</p>
                <p>This email was sent to <a href="mailto:${safeEmail}">${safeEmail}</a>. If you did not create an account with us, please ignore this message.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = DynamicEmail