const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateAdventure } = require('../middleware');
const newAdventures = require('../controllers/newAdventures');
const Place = require('../models/place');

//Using this route we land into the different posts users have posted
router.get('/', catchAsync(newAdventures.index));

//Get the form to post a new place
router.get('/new', isLoggedIn, newAdventures.renderNewForm);

//Using this route takes us to a specific post
router.get('/:id', catchAsync(newAdventures.showAdventure));

//Get the edit form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(newAdventures.renderEditForm));

module.exports = router;