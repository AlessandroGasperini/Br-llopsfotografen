const express = require('express');
const nedb = require('nedb-promise');

const router = express.Router()


const picturesDB = new nedb({
    filename: 'pictures.db',
    autoload: true
});

const favouritesDB = new nedb({
    filename: 'favourites.db',
    autoload: true
});

// lägger till tagen bild
// router.post('/', async (request, response) => {
//     const credentials = request.body;
//     picturesDB.insert(credentials);
//     response.send(credentials)
// });

// Hämtar alla bilder
router.put('/', async (request, response) => {
    const credentials = request.body;

    const getPictures = await picturesDB.find({
        user: credentials.user
    });
    response.send(getPictures)
});


// Tar bort en bild
router.delete('/', async (request, response) => {
    const credentials = request.body;

    const getPicture = await picturesDB.find({
        _id: credentials.picture
    });


    const removePic = await picturesDB.remove({
        _id: getPicture[0]._id
    }, {}, function (err, numRemoved) {});

    response.json(removePic)
});


// Lägger till bild i favoriter
router.post('/', async (request, response) => {
    const credentials = request.body;
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!", credentials);

    favouritesDB.insert(credentials);

    // response.json(removePic)
});




module.exports = router