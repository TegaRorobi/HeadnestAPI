require('dotenv').config()
const nodeMailer = require('nodemailer');
const logger = require ('./logger')

async function sendTestEmail() {
    
    const transporter = nodeMailer.createTransport({

        service : 'gmail',
        auth : {
            user : process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from : ` "Headnest Test" <${process.env.EMAIL_USER}>`,
            to : process.env.EMAIL_USER,
            subject : "Test Email from Node.js",
            text : "This is a test email sent from Node.js using Nodemailer",
            html : "<h1>Test Email</h1><p>Sent successfully via Node.js</p>"
        })

      console.log("✅ Email sent successfully:", info.messageId);
    } catch (error) {
        logger.error(error)
        console.error("❌ Failed to send email:", error.message);
    }
}

sendTestEmail();