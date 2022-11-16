const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

// register route
router.route('/register')
    //Renders register form
    .get(users.renderRegister)
    // registers a user
    .post(catchAsync(users.register));


// login route
router.route('/login')
    //Renders login form
    .get(users.renderLogin)
    //Displays success message if log in was success, displays login page again otherwise
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login);

//Logs out and takes user back to home page
router.get('/logout', users.logout)

module.exports = router;