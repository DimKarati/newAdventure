//Different requires, think about it as requiring stuff in C programming, similar concept
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
//Method Override so we can use edit and delete posts
const methodOverride = require('method-override');
const Place = require('./models/place');
const { adventureSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');
//Tool for layout
const ejsMate = require('ejs-mate');

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

// validates the input when creating a post
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

// validates the input when creating a review
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}


//Parse the body with express
app.use(express.urlencoded({extended: true}));
//Use method override to be able to use requests like delete and edit
app.use(methodOverride('_method'));


//This is the home page
app.get('/', (req, res) => {
    res.render('home');
});

//This is the sign up page
app.get('/signup', (req, res) => {
    res.render('signup');
});

//Using this route we land into the different posts users have posted
app.get('/newAdventures', catchAsync(async (req, res, next) => {
    const places = await Place.find({});
    res.render('places/index', { places })
}));

//Get the form to post a new place
app.get('/newAdventures/new', (req, res) => {
    res.render('places/new');
});

//Send a post request to add this new place to the database
app.post('/places', validateAdventure, catchAsync(async (req, res, next) => {
    const place = new Place(req.body.place);
    await place.save();
    res.redirect(`/newAdventures/${place._id}`);
}));

//Using this route takes us to a specific post
app.get('/newAdventures/:id', catchAsync(async (req, res, next) => {
    const place = await Place.findById(req.params.id).populate('reviews');
    res.render('places/show', {place});
}));

//Get the edit form
app.get('/newAdventures/:id/edit', catchAsync(async (req,res, next) =>{
    const place = await Place.findById(req.params.id)
    res.render('places/edit', {place});
}));

//Update the post using put request
app.put('/places/:id', validateAdventure, catchAsync(async (req,res, next) => {
    //Get the id of the post from the request
    const {id} = req.params;
    //Find the post given the id and update it
    const place = await Place.findByIdAndUpdate(id, {...req.body.place});
    //Reditect to the post that was just updated
    res.redirect(`/newAdventures/${place._id}`);
}));

//Delete a post
app.delete('/places/:id', catchAsync(async (req,res, next) => {
    //Get the id of the post from the request
    const {id} = req.params;
    //Find the post given the id and delete it
    const place = await Place.findByIdAndDelete(id);
    //Reditect to the posts
    res.redirect('/newAdventures');
    
}))

// create and post a review to a specific place
app.post('/places/:id/reviews', validateReview, catchAsync(async (req, res, next) => {
    const place = await Place.findById(req.params.id);
    const review = new Review(req.body.review);
    place.reviews.push(review);
    await review.save();
    await place.save();
    res.redirect(`/newAdventures/${place._id}`);
}))

// delete a review
app.delete('/places/:id/reviews/:reviewID', catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    //await Place.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    //await Review.findByIdAndDelete(reviewId);
    //res.redirect(`/newAdventures/${id}`);
    const place = await Place.findById(req.params.id);
    console.log(req.params);
    console.log(id);
    console.log(reviewId);
    res.send("works");
}))

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