const escapeHtml = (unsafe) => {
    if (typeof unsafe !== 'string') return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

const formatAmount = (amount) => {
    if (typeof amount !== 'number') return '';
    return new Intl.NumberFormat('en-NG', { style: 'decimal', minimumFractionDigits: 2 }).format(amount);
}

exports.orderMailToSeller = (buyerDetails, cartDetails, totalAmount, orderID) => {
    const safeBuyerName = escapeHtml(buyerDetails.name);
    const safeBuyerEmail = escapeHtml(buyerDetails.email);
    const safeBuyerPhone = escapeHtml(buyerDetails.phone);
    const safeOrderID = escapeHtml(orderID);
    const safeTotalAmount = escapeHtml(formatAmount(totalAmount));

    const cartItems = cartDetails.map(item => `<li>${escapeHtml(item)}</li>`).join('');

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Order Received</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td style="padding: 20px 0;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
                            <tr>
                                <td align="center" bgcolor="#0077BE" style="padding: 20px; color: white; font-family: Arial, sans-serif; border-radius: 8px 8px 0 0; font-size: 24px; font-weight: bold;">
                                    New Order Received
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#ffffff" style="padding: 20px; font-family: Arial, sans-serif; font-size: 16px; color: #333333;">
                                    <p><strong>Buyer Name:</strong> ${safeBuyerName}</p>
                                    <p><strong>Email:</strong> ${safeBuyerEmail}</p>
                                    <p><strong>Phone:</strong> ${safeBuyerPhone}</p>
                                    <p><strong>Order ID:</strong> ${safeOrderID}</p>
                                    <p><strong>Cart Details:</strong></p>
                                    <ul>${cartItems}</ul>
                                    <p><strong>Total Amount:</strong> ₦${safeTotalAmount}</p>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#f4f4f4" style="padding: 20px; text-align: center; font-family: Arial, sans-serif; font-size: 12px; color: #777777;">
                                    <p>© ${new Date().getFullYear()} PaySphere.ltd, 203 Muyibi Road</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
}

exports.orderMailToBuyer = (buyerDetails, cartDetails, totalAmount, orderID) => {
    const safeBuyerName = escapeHtml(buyerDetails.name);
    const safeOrderID = escapeHtml(orderID);
    const safeTotalAmount = escapeHtml(formatAmount(totalAmount));

    const cartItems = cartDetails.map(item => `<li>${escapeHtml(item)}</li>`).join('');

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td style="padding: 20px 0;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
                            <tr>
                                <td align="center" bgcolor="#0077BE" style="padding: 20px; color: white; font-family: Arial, sans-serif; border-radius: 8px 8px 0 0; font-size: 24px; font-weight: bold;">
                                    Order Confirmation
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#ffffff" style="padding: 20px; font-family: Arial, sans-serif; font-size: 16px; color: #333333;">
                                    <p>Thank you for your order, ${safeBuyerName}!</p>
                                    <p><strong>Order ID:</strong> ${safeOrderID}</p>
                                    <p><strong>Cart Details:</strong></p>
                                    <ul>${cartItems}</ul>
                                    <p><strong>Total Amount:</strong> ₦${safeTotalAmount}</p>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#f4f4f4" style="padding: 20px; text-align: center; font-family: Arial, sans-serif; font-size: 12px; color: #777777;">
                                    <p>© ${new Date().getFullYear()} PaySphere.ltd, 203 Muyibi Road</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
}