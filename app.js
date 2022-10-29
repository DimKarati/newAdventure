//Different requires, think about it as requiring stuff in C programming, similar concept
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Place = require('./models/place');
const { adventureSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const validateAdventure = (req, res, next) => {
    const { error } = adventureSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

//This is the landing page
app.get('/', (req, res) => {
    res.render('home');
})

//Using this route we land into the different posts users have posted
app.get('/newAdventures', catchAsync(async (req, res, next) => {
    
    const places = await Place.find({});
    res.render('places/index', { places })
}))

app.get('/newAdventures/new', (req, res) => {
    res.render('newAdventures/new');
})

app.post('/newAdventures', validateAdventure, catchAsync(async (req, res, next) => {
    const places = new Place(req.body.places);
    await places.save();
    res.redirect(`/campgrounds/${places._id}`)
}))

//Using this route takes us to a specific post
app.get('/newAdventures/:id', catchAsync(async (req, res, next) => {
    res.render('places/show');
}))

// temporary error handler
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
})