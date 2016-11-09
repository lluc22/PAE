var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/

// set up a mongoose model
var UserPostSchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    displayName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('UserPost', UserPostSchema);