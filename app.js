//Different requires, think about it as requiring stuff in C programming, similar concept
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Place = require('./models/place');

//Connecting to MongoDB Cluster
mongoose.connect('mongodb+srv://newAdventuredb:zOVtF2Kyh2pbUyZ5@cluster0.mqdwegs.mongodb.net/new-Adventure');

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


//This is the landing page
app.get('/', (req, res) => {
    res.render('home');
})


//Using this route we land into the different posts users have posted
app.get('/newAdventures', async (req, res) => {
    
    const places = await Place.find({});
    res.render('places/index', { places })
})


//Using this route takes us to a specific post
app.get('/newAdventures/:id', async (req, res) => {
    res.render('places/show');
})


//The port that the app uses locally for display 
app.listen(3000, () => {
    console.log('Serving on port 3000');
})