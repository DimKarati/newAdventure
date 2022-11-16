const Place = require('../models/place');

// controller files contain all the logic for routing

// controller to create a new place
module.exports.createPlace = async (req, res, next) => {
    const place = new Place(req.body.place);
    place.author = req.user._id;
    await place.save();
    req.flash('success', 'Successfully made a new post!')
    res.redirect(`/newAdventures/${place._id}`);
}

// controller to update a place
module.exports.updatePlace = async (req,res, next) => {
    //Get the id of the post from the request
    const {id} = req.params;
    //Find the post given the id and updates it
    const place = await Place.findByIdAndUpdate(id, {...req.body.place});
    req.flash('success', 'Successfully updated post!')
    //Redirect to the post that was just updated
    res.redirect(`/newAdventures/${place._id}`);
}

// controller to delete a post
module.exports.deletePlace = async (req,res, next) => {
    //Get the id of the post from the request
    const {id} = req.params;
    //Find the post given the id and delete it
    const place = await Place.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted post!')
    //Redirect to the posts
    res.redirect('/newAdventures');
    
}