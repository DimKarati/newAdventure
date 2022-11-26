const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const reviews = require('../controllers/reviews');
const NewAdventure = require('../models/newAdventure');
const Review = require('../models/review');

// create and post a review to a specific place
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

// delete a review
router.delete('/:reviewID', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;