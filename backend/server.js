const express = require('express');
const nedb = require('nedb-promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const bcryptFunctions = require('./bcrypt');


app.use(cors({
    origin: '*'
}));

app.use(express.json());

const accountsDB = new nedb({
    filename: 'accounts.db',
    autoload: true
});

const eventDB = new nedb({
    filename: 'event.db',
    autoload: true
});

const picturesDB = new nedb({
    filename: 'pictures.db',
    autoload: true
});




app.listen(2500, () => {
    console.log('Server is running on port 2500');
});