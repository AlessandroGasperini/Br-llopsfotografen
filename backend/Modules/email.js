const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router()

router.post('/', async (request, response) => {
    const emailData = request.body

    const from = emailData.from
    const to = emailData.to
    const subject = emailData.subject
    const message = emailData.message

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "asg.gasperini@gmail.com",
            pass: "hmwpmvoknzvanazj"
        }
    })

    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: message
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: ", info.response);
        }
    })
});


module.exports = router