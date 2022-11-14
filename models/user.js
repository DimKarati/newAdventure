const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passortLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});

//Makes sure usernames are unique, adds a field for password, and provides static methods
UserSchema.plugin(passortLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
