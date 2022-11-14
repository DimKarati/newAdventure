const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

const Place = require('../models/place');

//Using this route we land into the different posts users have posted
router.get('/', catchAsync(async (req, res, next) => {
    const places = await Place.find({});
    res.render('places/index', { places })
}));

//Get the form to post a new place
router.get('/new', isLoggedIn, (req, res) => {
    res.render('places/new');
});

//Using this route takes us to a specific post
router.get('/:id', catchAsync(async (req, res, next) => {
    const place = await Place.findById(req.params.id).populate('reviews');
    if(!place)
    {
        req.flash('error', 'Cannot find that post!')
        return res.redirect('/newAdventures');
    }
    res.render('places/show', {place});
}));

//Get the edit form
router.get('/:id/edit', isLoggedIn, catchAsync(async (req,res, next) =>{
    const place = await Place.findById(req.params.id)
    if(!place)
    {
        req.flash('error', 'Cannot find that post to edit!')
        return res.redirect('/newAdventures');
    }
    res.render('places/edit', {place});
}));

module.exports = router;