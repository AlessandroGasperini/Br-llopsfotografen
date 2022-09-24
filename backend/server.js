const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path'); //????

const app = express();


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



app.use("/login", account)
app.use("/signup", account)
app.use("/loggedIn", account)
app.use("/deleteAccount", account)
app.use("/getAllGuests", account)
app.use("/changeTitle", account)
app.use("/getEventTitle", account)

app.use("/addPicture", camera)
app.use("/pictures", camera)
app.use("/deletePicture", camera)
app.use("/deleteEventPictures", camera)

app.use("/sendEmail", email)


// email function
// app.use(express.static(path.join(__dirname, "static"))) //???????????????????????????????



app.listen(2500, () => {
    console.log('Server is running on port 2500');
});