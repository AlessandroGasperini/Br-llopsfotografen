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
router.post('/userGallery', async (request, response) => {
    const credentials = request.body;

    // Om admin hämta alla bilder kopplade till eventet
    if (credentials.admin) {

        const getAllPictures = await picturesDB.find({
            eventKey: credentials.eventKey
        });

        response.send(getAllPictures)

        // Om guest hämta enbart deras bilder
    } else if (!credentials.admin) {
        const getPictures = await picturesDB.find({
            user: credentials.user,
            eventKey: credentials.eventKey
        });

        response.send(getPictures)
    }
});


// Tar bort en bild
router.delete('/', async (request, response) => {
    const credentials = request.body;

    const removePic = await picturesDB.remove({
        _id: credentials.picture
    });

    const newGallery = await picturesDB.find({
        user: credentials.user
    })

    const newGalleryAdmin = await picturesDB.find({
        eventKey: credentials.eventKey
    })

    // skickar tillbaka hela listan igen om admin raderat en bild
    response.json(credentials.admin ? newGalleryAdmin : newGallery)

});


// Tar bort alla bilder från ett event efter att de skickats på mail
router.delete('/eventGallery', async (request, response) => {
    const credentials = request.body;

    picturesDB.remove({
        eventKey: credentials.eventKey
    }, {
        multi: true
    });

});



module.exports = router