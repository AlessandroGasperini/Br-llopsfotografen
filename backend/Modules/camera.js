const express = require('express');
const nedb = require('nedb-promise');

const router = express.Router()

// const accountsDB = new nedb({
//     filename: 'accounts.db',
//     autoload: true
// });

// const eventDB = new nedb({
//     filename: 'event.db',
//     autoload: true
// });

const picturesDB = new nedb({
    filename: 'pictures.db',
    autoload: true
});


router.post('/', async (request, response) => {
    const credentials = request.body;
    picturesDB.insert(credentials);
    response.send(credentials)
});

router.put('/', async (request, response) => {
    const credentials = request.body;

    const getPictures = await picturesDB.find({
        user: credentials.user
    });
    console.log("hehhehhehhhehhhehh", getPictures);
    response.send(getPictures)
});



router.delete('/', async (request, response) => {

    const resObj = {
        success: false
    }

    const credentials = request.body;

    const getAllPictures = await picturesDB.find({
        user: credentials.user
    });

    const getPicture = await picturesDB.find({
        _id: credentials.picture
    });


    picturesDB.remove({
        _id: getPicture[0]._id
    }, {}, function (err, numRemoved) {
        if (numRemoved == 1) {
            resObj.success = true
        }
    });


    response.send(resObj)
});



module.exports = router