var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/

// set up a mongoose model
var PostSchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    acceptedAnswerId: {
        type: String
    },
    creationDate: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    ownerUserId: {
        type: String,
        required: true
    },
    closedDate: {
        type: Date
    },
    title: {
        type: String,
        required: true
    },
    tags: [
        { name: String }
    ],
    bestAnswer: {
        ownerId: String,
        body: String
    },
    answers: [{
        ownerId: String,
        body: String
    }],
    vector: {
        type: String
    }
});

module.exports = mongoose.model('Post', PostSchema);
