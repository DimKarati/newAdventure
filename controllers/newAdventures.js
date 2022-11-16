const Place = require('../models/place');

// controller files contain all the logic for routing

// controller for index page
module.exports.index = async (req, res, next) => {
    const places = await Place.find({});
    res.render('places/index', { places })
}

// controller to get the new place form
module.exports.renderNewForm = (req, res) => {
    res.render('places/new');
}

// controller to show a specific place
module.exports.showAdventure = async (req, res, next) => {
    const place = await Place.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author' // populates the author of each of the reviews on the post
        }
    }).populate('author'); // populates the author of the post
    console.log(place);
    if(!place)
    {
        req.flash('error', 'Cannot find that post!')
        return res.redirect('/newAdventures');
    }
    res.render('places/show', {place});
}

// controller to get the edit form
module.exports.renderEditForm = async (req,res, next) =>{
    const { id } = req.params;
    const place = await Place.findById(id)
    if(!place)
    {
        req.flash('error', 'Cannot find that post to edit!')
        return res.redirect('/newAdventures');
    }
    res.render('places/edit', {place});
}