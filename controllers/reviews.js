const Place = require('../models/place');
const Review = require('../models/review');

// controller files contain all the logic for routing

// controller for creating a review
module.exports.createReview = async (req, res, next) => {
    const place = await Place.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash('success', 'Successfully created new review!')
    res.redirect(`/newAdventures/${place._id}`);
}

// controller for deleting a review
module.exports.deleteReview = async (req, res, next) => {
    const reviewID = req.params['reviewID'];
    await Place.findByIdAndUpdate(req.params.id, {$pull: {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/newAdventures/${req.params.id}`);
}