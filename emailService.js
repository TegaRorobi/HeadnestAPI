require('dotenv').config()
const nodeMailer = require('nodemailer');
const logger = require('./logger')

async function sendWelcomeEmail(userEmail) {
    console.log(`Attempting to send welcome email to: ${userEmail}`);
    
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"Headnest" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "Welcome to Headnest",
            text: "Thanks for signing up!",
            html: "<h1>Welcome to Headnest</h1><p>Thanks for signing up.</p>",
        });

        console.log("Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        logger.error(error);
        console.error("Failed to send email:", error.message); 
        throw error; 
    }
}

module.exports = sendWelcomeEmail;