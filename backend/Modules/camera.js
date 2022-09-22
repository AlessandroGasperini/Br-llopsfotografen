const express = require('express');
const nedb = require('nedb-promise');

const router = express.Router()


const picturesDB = new nedb({
    filename: 'pictures.db',
    autoload: true
});



// lägger till tagen bild
router.post('/', async (request, response) => {
    const credentials = request.body;
    picturesDB.insert(credentials);
    response.send(credentials)
});


// Hämtar alla bilder
router.put('/', async (request, response) => {
    const credentials = request.body;

    const getPictures = await picturesDB.find({
        user: credentials.user
    });

    response.send(getPictures)
});


// Tar bort en bild
// router.delete('/', async (request, response) => {
//     const credentials = request.body;

//     const removePic = await picturesDB.remove({
//         _id: credentials.picture
//     }, {}, function (err, numRemoved) {});

// });

router.delete('/', async (request, response) => {
    const credentials = request.body;

    console.log(credentials.userInfo);


    const removePic = await picturesDB.remove({
        _id: credentials.userInfo
    }, {}, function (err, numRemoved) {});

    response.json(credentials)

});




module.exports = router