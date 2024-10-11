const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const formatAmount = (amount) => {
    // Ensure the amount is a number
    const num = Number(amount)
    if (isNaN(num)) {
        return amount
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num)
}

const requestEmail = (name, amount, paymentLink, denyLink, email) => {
    const safeName = escapeHtml(name);
    const safeAmount = escapeHtml(formatAmount(amount));
    const safePaymentLink = escapeHtml(paymentLink);
    const safeDenyLink = escapeHtml(denyLink);
    const safeEmail = escapeHtml(email);
    const currentYear = new Date().getFullYear();

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You've Received Money!</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            .button-container {
                text-align: center;
                margin: 15px 0;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 0 10px;
            }
            .button.reject-button {
                background-color: #dc3545;
            }
            td {
                font-family: Arial, sans-serif;
                font-size: 16px;
                color: #333333;
            }

            /* Media Query for smaller screens */
            @media only screen and (max-width: 600px) {
                td {
                    font-size: 12px;
                }
                .button {
                    padding: 8px 12px;
                    font-size: 12px;
                }
                p {
                    font-size: 12px;
                }
                .button-container {
                    margin: 10px 0;
                }
            }
        </style>
    </head>
    <body>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td style="padding:20px 0;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse;">
                       <tr>
                            <td align="center" bgcolor="#0077BE" style="padding: 20px; color: white; font-family: Arial, sans-serif; font-size: 22px; font-weight: bold;">
                                Request from a PaySphere user
                            </td>
                        </tr>
                        <!-- Email Body -->
                        <tr>
                            <td bgcolor="#ffffff" style="padding: 20px; font-family: Arial, sans-serif; font-size: 16px; color: #333333;">
                                <p>You've received a payment request from <strong>${safeName}</strong>.</p>
                                <p><strong>Amount:</strong> ${safeAmount}</p>
                                <p>Click either of the buttons below to approve the payment or deny it.</p>
                                <div class="button-container">
                                    <a href="${safePaymentLink}" class="button pay-button">Pay Now</a>
                                    <a href="${safeDenyLink}" class="button reject-button">Reject</a>
                                </div>
                                <p>By approving the request, the money will be deducted from your wallet and transferred to paysphere user's wallet if you have sufficient funds.</p>
                            </td>
                        </tr>
                        <!-- Email Footer -->
                        <tr>
                            <td bgcolor="#f4f4f4" style="padding: 20px; text-align: center; font-family: Arial, sans-serif; font-size: 12px; color: #777777;">
                                <p>© ${currentYear} PaySphere.ltd, 203 Muyibi Road</p>
                                <p>This message was sent by <a href="mailto:${safeEmail}" style="color: #777777;">${safeEmail}</a>.</p>
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

module.exports = { requestEmail }