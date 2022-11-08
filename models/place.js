const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');


const NewPlaceSchema = new Schema({
    title: String,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

NewPlaceSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Place', NewPlaceSchema);










