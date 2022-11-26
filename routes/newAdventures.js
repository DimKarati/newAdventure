const express = require('express');
const router = express.Router();
const newAdventures = require('../controllers/newAdventures');

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateNewAdventure } = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});
const NewAdventure = require('../models/newAdventure');



router.route('/')
    .get(catchAsync(newAdventures.index))
    .post(isLoggedIn, upload.array('image'), validateNewAdventure, catchAsync(newAdventures.createNewAdventure));


//Get the form to post a new place
router.get('/new', isLoggedIn, newAdventures.renderNewForm);

//Using this route takes us to a specific post
router.route('/:id')
    .get(catchAsync(newAdventures.showNewAdventure))
    .put(isLoggedIn, isAuthor, validateNewAdventure, catchAsync(newAdventures.updateNewAdventure))
    .delete(isLoggedIn, isAuthor, catchAsync(newAdventures.deleteNewAdventure));
    
//Get the edit form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(newAdventures.renderEditForm));

module.exports = router;