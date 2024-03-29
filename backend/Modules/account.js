const express = require('express');
const nedb = require('nedb-promise');
const jwt = require('jsonwebtoken');

const router = express.Router()
const bcryptFunctions = require('../bcrypt');


const accountsDB = new nedb({
    filename: 'accounts.db',
    autoload: true
});

const eventDB = new nedb({
    filename: 'event.db',
    autoload: true
});

const eventVisitors = new nedb({
    filename: 'eventVisitors.db',
    autoload: true
});



//Skapa konto
router.post('/', async (request, response) => {
    const credentials = request.body;

    const resObj = {
        success: true,
        usernameExists: false,
        emailExists: false,
        eventKeyExists: false
    };

    //kolla igenom accountDB och se om användaren redan finns?
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
        //hasha lösen
        const hashedPassword = await bcryptFunctions.hashPassword(credentials.password);
        credentials.password = hashedPassword;
        accountsDB.insert(credentials);

        if (credentials.eventKey && resObj.eventKeyExists === false) {
            let event = {
                title: credentials.title,
                username: credentials.username,
                eventKey: credentials.eventKey
            }
            eventDB.insert(event);
        }
    }
    // se om eventkoden redan finns (generera en ny (uppskjutet))
    if (eventKey.length > 0) {
        resObj.eventKeyExists = true
    }
    response.json(resObj);
});


// Logga in 
router.post('/getUser', async (request, response) => {
    const credentials = request.body;
    const resObj = {
        usernameBool: false,
        success: false,
        token: "",
        eventKeySuccess: false,
        admin: false,
        eventTitle: "",
        name: "",
        email: ""
    };

    const account = await accountsDB.find({
        username: credentials.username
    });

    const findEvent = await eventDB.find({
        eventKey: credentials.eventKey
    });

    const eventGuestList = await eventVisitors.find({
        username: credentials.username,
        eventKey: credentials.eventKey
    });


    // Lägg till användaren i eventvisitors. Om man redan har varit inloggad struta i det
    if (findEvent.length > 0) {
        const event = findEvent[0]
        const keyInput = credentials.eventKey

        resObj.eventTitle = event.title

        if (event.eventKey === keyInput) {
            resObj.eventKeySuccess = true
        }

        if (event.username === credentials.username) {
            resObj.admin = true
        }

    }

    if (account.length > 0) {
        let visitorObj = {
            username: credentials.username,
            eventKey: credentials.eventKey,
            email: account[0].email
        }
        if (eventGuestList.length === 0) {
            eventVisitors.insert(visitorObj);
        }
        resObj.usernameBool = true
        resObj.name = account[0].firstName
        resObj.email = account[0].email
        const correctPassword = await bcryptFunctions.comparePassword(credentials.password, account[0].password);
        if (correctPassword) {
            resObj.success = true;
            // kryptera en token
            const token = jwt.sign({
                username: account[0].username
            }, "goodgood", { //vår token blir krypterad med användarens användarnamn som kopplar vår token till användaren (goodgood)
                expiresIn: 600
            });
            resObj.token = token;
        }
    }

    response.json(resObj);
});


//kolla om användaren är inloggad
router.get('/', async (request, response) => {
    let resObj = {
        loggedIn: false
    };

    const token = request.headers.authorization.replace('Bearer ', '');
    try {
        //jämför vår token mot den satta
        const data = jwt.verify(token, 'goodgood');
        if (data) {
            resObj.loggedIn = true;
        }
    } catch (error) {
        resObj.errorMessage = 'Token expired';
    }
    response.json(resObj);
});

//Radera användaren, eventvisitors och eventet
router.delete('/', async (request, response) => {
    let credentials = request.body

    deleteEvent(credentials.userInfo)

    const deleteAccount = await accountsDB.remove({
        username: credentials.userInfo
    });

    if (deleteAccount.length > 0) {
        resObj.success = true
    }

    eventVisitors.remove({
        eventKey: credentials.eventKey
    }, {
        multi: true
    });

});

function deleteEvent(user) {
    const deleteEvent = eventDB.remove({
        username: user
    });
}

// Byt ut titelNamn
router.put('/', async (request, response) => {
    let credentials = request.body
    const eventKey = await eventDB.findOne({
        title: credentials.title
    });

    eventDB.update({
        title: credentials.title
    }, {
        $set: {
            title: credentials.newTitle
        }
    })

    accountsDB.update({
        title: credentials.title
    }, {
        $set: {
            title: credentials.newTitle
        }
    })
});

// Hämta allas email som deltagit i eventet (använt koden)
router.post('/getEmails', async (request, response) => {
    let credentials = request.body

    const eventKey = await eventVisitors.find({
        eventKey: credentials.eventKey
    });

    response.json(eventKey)

});



module.exports = router