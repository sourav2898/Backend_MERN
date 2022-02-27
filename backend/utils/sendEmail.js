const nodeMailer = require('nodemailer');

exports.sendEmail = async ({email,subject,message}) => {

    // console.log(email, subject, message);
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE,
        auth:{
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: subject,
        text: message
    }

    // console.log("mailoption",mailOptions);
    // console.log("transporter",transporter);

    await transporter.sendMail(mailOptions);
}