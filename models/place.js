
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const NewPlaceSchema = new Schema({
    title: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Place', NewPlaceSchema);










