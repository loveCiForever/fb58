const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        throw new Error(`Email sending failed: ${error.message}`);
    }
};

module.exports = sendEmail; 