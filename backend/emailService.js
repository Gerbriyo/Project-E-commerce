// emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use other services like 'Yahoo', 'Outlook', etc.
    auth: {
       user: 'gerald.briyolan2002@gmail.com',
    pass: 'zxuy ltvq zhjr tqip'
    }
});

const sendWelcomeEmail = (to, name) => {
    const mailOptions = {
        from: 'gerald.briyolan2002@gmail.com',
        to: to,
        subject: 'Welcome to Our Service!',
        text: `Hello ${name},\n\nThank you for signing up. We are excited to have you on board!`
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendWelcomeEmail };
