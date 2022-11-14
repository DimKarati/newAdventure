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