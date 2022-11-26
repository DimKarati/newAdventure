const NewAdventure = require('../models/newAdventure');
const Review = require('../models/review');

// controller files contain all the logic for routing

// controller for creating a review
module.exports.createReview = async (req, res, next) => {
    const newAdventure = await NewAdventure.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    newAdventure.reviews.push(review);
    await review.save();
    await newAdventure.save();
    req.flash('success', 'Successfully created new review!')
    res.redirect(`/newAdventures/${newAdventure._id}`);
}

// controller for deleting a review
module.exports.deleteReview = async (req, res, next) => {
    const reviewID = req.params['reviewID'];
    await NewAdventure.findByIdAndUpdate(req.params.id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/newAdventures/${req.params.id}`);
}