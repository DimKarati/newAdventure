const NewAdventure = require('../models/newAdventure');
//const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
//const mapBoxToken = process.env.MAPBOX_TOKEN;
//const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
//const { cloudinary } = require("../cloudinary");

// controller files contain all the logic for routing

// controller for index page
module.exports.index = async (req, res) => {
    const newAdventures = await NewAdventure.find({});
    res.render('newAdventures/index', { newAdventures })
}

// controller to get the new place form
module.exports.renderNewForm = (req, res) => {
    res.render('newAdventures/new');
}


module.exports.createNewAdventure = async (req, res, next) => {
    // const geoData = await geocoder.forwardGeocode({
    //     query: req.body.campground.location,
    //     limit: 1
    // }).send()
    const newAdventure = new NewAdventure(req.body.newAdventure);
    //newAdventure.geometry = geoData.body.features[0].geometry;
    newAdventure.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newAdventure.author = req.user._id;
    await newAdventure.save();
    console.log(newAdventure);
    req.flash('success', 'Successfully made a new Adventure!');
    res.redirect(`/newAdventures/${newAdventure._id}`)
}

// controller to show a specific place
module.exports.showNewAdventure = async (req, res, next) => {
    const newAdventure = await NewAdventure.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author' // populates the author of each of the reviews on the post
        }
    }).populate('author'); // populates the author of the post
    console.log(newAdventure);
    if (!newAdventure) {
        req.flash('error', 'Cannot find that post!')
        return res.redirect('/newAdventures');
    }
    res.render('newAdventures/show', { newAdventure });
}

// controller to get the edit form
module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const newAdventure = await NewAdventure.findById(id)
    if (!newAdventure) {
        req.flash('error', 'Cannot find that post to edit!')
        return res.redirect('/newAdventures');
    }
    res.render('newAdventures/edit', { newAdventure });
}


module.exports.updateNewAdventure = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const newAdventure = await NewAdventure.findByIdAndUpdate(id, { ...req.body.newAdventure });
    //const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    //campground.images.push(...imgs);
    await newAdventure.save();
    // if (req.body.deleteImages) {
    //     for (let filename of req.body.deleteImages) {
    //         await cloudinary.uploader.destroy(filename);
    //     }
    //     await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    // }
    req.flash('success', 'Successfully updated the Adventure!');
    res.redirect(`/newAdventures/${newAdventure._id}`)
}

module.exports.deleteNewAdventure = async (req, res) => {
    const { id } = req.params;
    await NewAdventure.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the Adventure!')
    res.redirect('/newAdventures');
}