const { adventureSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Place = require('./models/place');
const Review = require('./models/review')

//Makes sure user is logged in before creating post/review
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //Stores the url they are requesting
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next();
}

 //Validates the input when creating a post
 module.exports.validateAdventure = (req, res, next) => {
    const { error } = adventureSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

//Check to see if user has permission (if it is their post they have permission)
module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    if(!place.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/newAdventures/${id}`);
    }
    next();
}

//Check to see if user has permission (if it is their review they have permission)
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/newAdventures/${id}`);
    }
    next();
}

// validates the input when creating a review
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}