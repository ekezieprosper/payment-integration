const deleteMail = (name, supportTeam, email) => {
    return `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Welcome to PaySphere</title>
    <style>
        body, table, td, a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            margin: 0;
            padding: 0;
        }
        table, td {
            border-collapse: collapse;
        }
        img {
            -ms-interpolation-mode: bicubic;
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
        }
        .header img {
            width: 120px;
            height: auto;
        }
        .header h1 {
            font-size: 20px; /* Header text size */
            color: #333333;
            margin-top: 10px;
        }
        .content {
            font-size: 14px; /* Content text size */
            color: #333333;
        }
        .content p {
            margin: 0 0 15px 0;
        }
        .footer {
            font-size: 10px; /* Footer text size */
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

        /* Media queries for responsiveness */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                padding: 10px;
            }
            .header h1 {
                font-size: 16px; /* Smaller header text for mobile */
            }
            .content {
                font-size: 12px; /* Smaller content text for mobile */
            }
            .footer {
                font-size: 8px; /* Smaller footer text for mobile */
            }
            img {
                width: 100px; /* Adjust logo size for mobile */
                height: auto;
            }
        }
    </style>
</head>
<body>
       <div class="email-container">
            <div class="header">
                <h1>Your account has been suspended for 365 days.</h1>
            </div>
            <div class="content">
                <p><b>${name}</b>, We regret to inform you that your account has been suspended due to violations of our terms and service. This action was taken after careful review and in accordance with our policies to ensure the security and integrity of our platform.</p>
                <p>If you believe this is a mistake or have any questions regarding the suspension, please contact our support team for further assistance at <a href="mailto:${supportTeam}" style="color: #007bff; text-decoration: underline;">support team</a>. We are here to help you resolve this matter as quickly as possible.</p>
            </div>
            <hr style="margin: 15px 0;">
            <footer class="footer">
                <p>© ${new Date().getFullYear()} PaySphere.ltd, 203 Muyibi Road</p>
                <p>This message was sent to <a href="mailto:${email}" style="color: #999;">${email}</a>.</p>
            </footer>
        </div>
    </body>
</html>
    `;
}

module.exports = deleteMail