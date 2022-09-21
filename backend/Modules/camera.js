const express = require('express');
const nedb = require('nedb-promise');

const router = express.Router()


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
    const credentials = request.body;

    const getPicture = await picturesDB.find({
        _id: credentials.picture
    });

    const removePic = await picturesDB.remove({
        _id: getPicture[0]._id
    }, {}, function (err, numRemoved) {

    });

    const getAllPictures = await picturesDB.find({
        user: credentials.user
    });

    response.send(getAllPictures)
});



module.exports = router