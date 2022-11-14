const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

//Renders form
router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        //Once the user has registered, log them in
        req.login(registeredUser, err => {
            if (err) return next (err);
            req.flash('success', 'Welcome to New Adventures');
            res.redirect('/newAdventures');
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

//Renders form
router.get('/login', (req, res) => {
    res.render('users/login');
})

//Displays success message if log in was success, displays login page again otherwise
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'welcome back!');
    //Redirects user to the page they were on before they logged in
    const redirectUrl = req.session.returnTo || '/newAdventures';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

//Logs out and takes user back to home page
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/newAdventures');
      });
})

module.exports = router;