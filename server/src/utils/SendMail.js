import nodemailer from "nodemailer";
require("dotenv").config();
import ejs from "ejs";
import path from "path";

const SendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.STMP_HOST,
        port: parseInt(process.env.STMP_PORT || '587'),
        service: process.env.STMP_SERVICE,
        auth: {
            user: process.env.STMP_MAIL,
            pass: process.env.STMP_PASSWORD,
        },
    });

    const { email, subject, template, data } = options;

    // Get the path to the email template file
    const templatePath = path.join(__dirname, "../mails", template);

    // Render the email template with EJS
    const html = await ejs.renderFile(templatePath, data);

    const mailOptions = {
        from: process.env.STMP_MAIL,
        to: email,
        subject,
        html,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

export default SendMail;


