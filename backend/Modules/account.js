const express = require('express');
const nedb = require('nedb-promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const router = express.Router()


const accountsDB = new nedb({
    filename: 'accounts.db',
    autoload: true
});

const eventDB = new nedb({
    filename: 'event.db',
    autoload: true
});


const bcryptFunctions = require('../bcrypt');


//Skapa konto
router.post('/', async (request, response) => {
    const credentials = request.body;

    const resObj = {
        success: true,
        usernameExists: false,
        emailExists: false,
        eventKeyExists: false
    };

    //kolla igenom db om namn eller email redan finns reggat
    const usernameExists = await accountsDB.find({
        username: credentials.username
    });
    const emailExists = await accountsDB.find({
        email: credentials.email
    });
    const eventKey = await eventDB.find({
        eventKey: credentials.eventKey
    });

    if (usernameExists.length > 0) {
        resObj.usernameExists = true;
    }
    if (emailExists.length > 0) {
        resObj.emailExists = true;
    }

    if (resObj.usernameExists || resObj.emailExists) {
        resObj.success = false;
    } else {
        const hashedPassword = await bcryptFunctions.hashPassword(credentials.password);
        credentials.password = hashedPassword;
        accountsDB.insert(credentials);
    }

    if (eventKey.length > 0) {
        resObj.eventKeyExists = true
    }

    if (credentials.eventKey && resObj.eventKeyExists === false) {
        let event = {
            title: credentials.title,
            username: credentials.username,
            eventKey: credentials.eventKey
        }

        eventDB.insert(event);
    }

    response.json(resObj);
});

// den är put atm men ska vara post
router.put('/', async (request, response) => {
    const credentials = request.body;

    const resObj = {
        username: false,
        success: false,
        token: "",
        eventKeySuccess: false,
        admin: false,
        eventTitle: "",
        name: ""
    };

    const account = await accountsDB.find({
        username: credentials.username
    });
    resObj.name = account[0].firstName

    const findEvent = await eventDB.find({
        eventKey: credentials.eventKey
    });


    if (findEvent.length > 0) {
        const event = findEvent[0]
        resObj.eventTitle = event.title

        const keyInput = credentials.eventKey
        if (event.eventKey === keyInput) {
            resObj.eventKeySuccess = true
        }

        if (event.username === credentials.username) {
            resObj.admin = true
        }
    }

    if (account.length > 0) {

        resObj.username = true

        const correctPassword = await bcryptFunctions.comparePassword(credentials.password, account[0].password);
        if (correctPassword) {
            resObj.success = true;

            const token = jwt.sign({
                username: account[0].username
            }, "goodgood", { //vår token blir krypterad med användarens användarnamn som kopplar vår token till användaren
                expiresIn: 600
            });
            resObj.token = token;
        }
    }



    response.json(resObj);
});




module.exports = router