const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');


//Configure Cloudinary.
cloudinary.config({
    cloud_name: process.env.NAME,
    api_key: process.env.KEY,
    api_secret: process.env.SECRET
});

//Set up an instance of Cloudinary so we can import it.
const storage = new CloudinaryStorage({

    cloudinary,
    params: {
        folder: 'newAdventure',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = { cloudinary, storage };