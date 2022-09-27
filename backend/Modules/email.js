const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router()

router.post('/', async (request, response) => {
    const emailData = request.body

    const from = emailData.from
    const to = emailData.to
    const subject = emailData.subject
    const message = emailData.message
    const attachments = emailData.attachments

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "phyllographen@gmail.com",
            pass: "kjxibzyyxhvdvjkh"
        }
    })

    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: message,
        attachments: attachments
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