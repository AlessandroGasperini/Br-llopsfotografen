const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 2500


app.use(cors({
    origin: '*'
}));

app.use(express.json({
    limit: '100mb'
}));

app.use(express.urlencoded({
    extended: true
}));

// Hämtar alla från Modules  
const account = require("./Modules/account")
const camera = require("./Modules/camera");
const email = require("./Modules/email");

// Account
app.use("/login", account)
app.use("/signup", account)
app.use("/loggedIn", account)
app.use("/deleteAccount", account)
app.use("/getAllGuests", account)
app.use("/changeTitle", account)
app.use("/getEventTitle", account)
app.use("/eventEmails", account)

//Camera
app.use("/addPicture", camera)
app.use("/pictures", camera)
app.use("/deletePicture", camera)
app.use("/deleteEventPictures", camera)

//Email
app.use("/sendEmail", email)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});