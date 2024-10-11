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

const payEmail = (senderName, amount, claimLink, senderEmail) => {
    const safeSenderName = escapeHtml(senderName);
    const safeAmount = escapeHtml(formatAmount(amount));
    const safeClaimLink = escapeHtml(claimLink);
    const safeSenderEmail = escapeHtml(senderEmail);
    const currentYear = new Date().getFullYear();

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You've Received Money!</title>
    </head>
    <body style="Margin:0;padding:0;background-color:#f4f4f4;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td style="padding:20px 0 20px 0;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse;">
                        <!-- Email Header -->
                        <tr>
                            <td align="center" bgcolor="#0077BE" style="padding: 20px; color: white; font-family: Arial, sans-serif; border-radius: 8px 8px 0 0; font-size: 24px; font-weight: bold;">
                                You've Received Money!
                            </td>
                        </tr>
                        <!-- Email Body -->
                        <tr>
                            <td bgcolor="#ffffff" style="padding: 20px; font-family: Arial, sans-serif; font-size: 16px; color: #333333;">
                                <p>Hi there,</p>
                                <p><strong>${safeSenderName}</strong> sent an amount of <strong>${safeAmount}</strong> to you.</p>
                                <p>To claim the money, click the button below to complete the transaction.</p>
                                <p>Sender's Email: <a href="mailto:${safeSenderEmail}" style="color: #0077BE;">${safeSenderEmail}</a></p>
                                <p style="text-align: center;">
                                    <a href="${safeClaimLink}" style="
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
                                    ">Claim Money</a>
                                </p>
                                <p>If you were not expecting the money or think it's a fraud, please ignore this email.</p>
                            </td>
                        </tr>
                        <!-- Email Footer -->
                        <tr>
                            <td bgcolor="#f4f4f4" style="padding: 20px; text-align: center; font-family: Arial, sans-serif; font-size: 12px; color: #777777;">
                                <p>© ${currentYear} PaySphere.ltd, 203 Muyibi Road</p>
                                <p>This email was sent by ${safeSenderName}. Please ignore this if you think it's a fraud.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `
}

module.exports = { payEmail }