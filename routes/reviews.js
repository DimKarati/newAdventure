const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { reviewSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');

const Place = require('../models/place');
const Review = require('../models/review');

// validates the input when creating a review
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

// create and post a review to a specific place
router.post('/', validateReview, catchAsync(async (req, res, next) => {
    const place = await Place.findById(req.params.id);
    const review = new Review(req.body.review);
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash('success', 'Successfully created new review!')
    res.redirect(`/newAdventures/${place._id}`);
}))

// delete a review
router.delete('/:reviewID', catchAsync(async (req, res, next) => {
    const reviewID = req.params['reviewID'];
    await Place.findByIdAndUpdate(req.params.id, {$pull: {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/newAdventures/${req.params.id}`);
}))

module.exports = router;