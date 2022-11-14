 const express = require('express');
 const router = express.Router();
 const catchAsync = require('../utils/catchAsync');
 const { adventureSchema } = require('../schemas.js');
 const { isLoggedIn } = require('../middleware');

 const ExpressError = require('../utils/ExpressError');
 const Place = require('../models/place');
 

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

 //Send a post request to add this new place to the database
router.post('/', isLoggedIn, validateAdventure, catchAsync(async (req, res, next) => {
    const place = new Place(req.body.place);
    await place.save();
    req.flash('success', 'Successfully made a new post!')
    res.redirect(`/newAdventures/${place._id}`);
}));

//Update the post using put request
router.put('/:id', isLoggedIn, validateAdventure, catchAsync(async (req,res, next) => {
    //Get the id of the post from the request
    const {id} = req.params;
    //Find the post given the id and update it
    const place = await Place.findByIdAndUpdate(id, {...req.body.place});
    req.flash('success', 'Successfully updated post!')
    //Reditect to the post that was just updated
    res.redirect(`/newAdventures/${place._id}`);
}));

//Delete a post
router.delete('/:id', isLoggedIn, catchAsync(async (req,res, next) => {
    //Get the id of the post from the request
    const {id} = req.params;
    //Find the post given the id and delete it
    const place = await Place.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted post!')
    //Reditect to the posts
    res.redirect('/newAdventures');
    
}))

module.exports = router;