const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();


app.use(cors({
    origin: '*'
}));

app.use(express.json({
    limit: '100mb'
}));


// Hämtar alla från Modules  
const account = require("./Modules/account")
const camera = require("./Modules/camera")

app.use("/login", account)
app.use("/signup", account)
app.use("/addPicture", camera)
app.use("/pictures", camera)
app.use("/deletePicture", camera)




app.listen(2500, () => {
    console.log('Server is running on port 2500');
});