const User = require('../models/user');

// controller files contain all the logic for routing

// controller for getting the register form
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

// controller for registering a user
module.exports.register = async (req, res, next) => {
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
}
 
// controller for getting the login form
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

// controller for logging in a user
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    //Redirects user to the page they were on before they logged in
    const redirectUrl = req.session.returnTo || '/newAdventures';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

// controller for logging out a user
module.exports.logout = function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/newAdventures');
      });
}