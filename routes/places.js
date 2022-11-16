const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateAdventure } = require('../middleware');
const places = require('../controllers/places');
const Place = require('../models/place');
 

 //Send a post request to add this new place to the database
router.post('/', isLoggedIn, validateAdventure, catchAsync(places.createPlace));

//Update the post using put request
router.put('/:id', isLoggedIn, isAuthor, validateAdventure, catchAsync(places.updatePlace));

//Delete a post
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(places.deletePlace))

module.exports = router;