var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/

// set up a mongoose model
var TopciSchema = new Schema({
        id: {
            type: String,
            unique: true,
            required: true,
            index: true
        },
        name: {
            type: String
        },
        palabras: [{
            name: String,
            valor: String
        }]
    }, { strict: false }
);

module.exports = mongoose.model('Topic', TopciSchema);
