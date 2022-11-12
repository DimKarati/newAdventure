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

//Require Routing
const newAdventures = require('./routes/newAdventures.js');
const places = require('./routes/places.js');
const reviews = require('./routes/reviews');

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
app.use(express.urlencoded({extended: true}));
//Use method override to be able to use requests like delete and edit
app.use(methodOverride('_method'));
//Serve static assets
app.use(express.static(path.join(__dirname, 'public')))
//Configuring sessions
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
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

//Flash middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//Take the routes for all the newAdventures
app.use('/newAdventures', newAdventures);
//Take the routes for all the places
app.use('/places', places);
//Take the routes for the reviews
app.use('/places/:id/reviews', reviews);

//This is the home page
app.get('/', (req, res) => {
    res.render('home');
});

//This is the sign up page
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!'
    res.status(status).render('error', { err });
})

//The port that the app uses locally for display 
app.listen(3000, () => {
    console.log('Serving on port 3000');
});