//Require all the libraries
require('dotenv').config();
//Different requires, think about it as requiring stuff in C programming, similar concept
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
//Method Override so we can use edit and delete posts
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
//Tool for layout
const ejsMate = require('ejs-mate');
//Flash messages and authentication
const session = require('express-session');
//Require Flash
const flash = require('connect-flash');
//Stategies for authentication
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

//Require Routing
const userRoutes = require('./routes/users');
const newAdventuresRoutes = require('./routes/newAdventures.js');
//const placesRoutes = require('./routes/places.js');
const reviewsRoutes = require('./routes/reviews');

//Connecting to MongoDB Cluster
mongoose.connect('mongodb+srv://newAdventuredb:zOVtF2Kyh2pbUyZ5@cluster0.mqdwegs.mongodb.net/?retryWrites=true&w=majority');

//Checking if the connection is successfull
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//Setting the app to use express
const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Parse the body with express
app.use(express.urlencoded({ extended: true }));
//Use method override to be able to use requests like delete and edit
app.use(methodOverride('_method'));
//Serve static assets
app.use(express.static(path.join(__dirname, 'public')))
//Configuring sessions
const sessionConfig = {
    secret: 'CS321-Fall-2022-Project!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
//Use LocalStrategy located in user model (called authenticate - provided method)
passport.use(new LocalStrategy(User.authenticate()));
//Stores and unstores user in the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Flash middleware
app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//Use the routes for users
app.use('/', userRoutes);
//Use the routes for all the newAdventures
app.use('/newAdventures', newAdventuresRoutes);
//Use the routes for all the reviews
app.use('/newAdventures/:id/reviews', reviewsRoutes);


//This is the home page
app.get('/', (req, res) => {
    res.render('home');
});

//This is the sign up page
app.get('/register', (req, res) => {
    res.render('register');
});

//Send an error 404 if any other route is tried to be accessed
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

//In case the server experienced an unexpected condition and was not able to handle the request 
//send an error message
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!'
    res.status(status).render('error', { err });
})

//The port that the app uses locally for display 
app.listen(3000, () => {
    console.log('Serving on port 3000');
});