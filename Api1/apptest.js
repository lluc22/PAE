var express     = require('express');
var extend = require('util')._extend;
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./app/models/user'); // get the mongoose model
var UserPost    = require('./app/models/userPost'); // get the mongoose model
var Post        = require('./app/models/post'); // get the mongoose model
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');
var PythonShell = require('python-shell');
var Parser = require('./app/services/parse.js');
var pyshell = new PythonShell('./app/services/doc2vec/doc2vec.py',{ mode: 'json', pythonPath:'/usr/local/bin/python3'});
var fs = require('fs');
// sends a message to the Python script via stdin
var chunkSize = 10000;
var chunks = 24;
var c = 0;
var model_path = "";
var size = 239932;
var busy = false;
var firstTopN = true;

var request = require('request');
var async = require('async');

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

// demo Route (GET http://localhost:8080)
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// Start the server
app.listen(port);
console.log('There will be dragons: http://localhost:' + port);


app.use(function (req, res, next) {
    // Request methods you wish to allow
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, skip, limit');

    // Pass to next layer of middleware
    next();
});


// connect to database
mongoose.connect(config.database);

// pass passport for configuration
require('./config/passport')(passport);

// bundle our routes
var apiRoutes = express.Router();

app.use(function(req, res, next) {
    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, skip, limit");
    next();
});


// connect the api routes under /api/*
app.use('/api', apiRoutes);

apiRoutes.get('/ticket/:id/related', function(req, res) {
    var callbackCounter = 0;
    var doc2vecCallback = function(data) {
        //res.json({success: 200, msg: {"data": data }});
        //res.json({success: 200, msg: {"data": data }});
        callbackCounter++;
        if (callbackCounter == 1) {
            res.json({success: 200, msg: {"data": data }});
        }
        else {
            res;
        }
        //console.log(data);*/
        //res.send('Hello! The API is at http://localhost:' + port + '/api');
    };
    var doc2vec = require('./app/services/doc2vec/doc2vec');
    doc2vec.topn_similar(req.params.id, 20, doc2vecCallback);
});

apiRoutes.get('/ticket/:id/related2', function(req, res, next) {
    var callbackCounter = 0;
    var doc2vecCallback = function(data) {
        callbackCounter++;
        if (callbackCounter == 1) {
            res.send('Hello! The API is at http://localhost:' + port + '/api.if');
        }
        else {
            res.send('Hello! The API is at http://localhost:' + port + '/api.if');
            console.log("callback.esle");
        }
    };
    var doc2vec = require('./app/services/doc2vec/doc2vec');
    var related = function(id,topn,fillIdCallback){
        if(!busy){
            busy = true;
            if(firstTopN){
                pyshell.on('message',function(message){
                    command = message['command'];
                    if(command == "topn"){
                        busy = false;
                        fillIdCallback(message['ids']);
                    }
                });
                firstTopN = false;
            }
            pyshell.send({command:"topn",n:topn,id:id});
        }
    };
    related(1,5,doc2vecCallback);
    //res.send('Hello! The API is at http://localhost:' + port + '/api');
});

apiRoutes.get('/ticket/:id/related3', function(req, res) {
    var count.number = 0;

    var related = function(id,topn,fillIdCallback){
        if(!busy){
            busy = true;
            if(firstTopN){
                pyshell.on('message',function(message){
                    command = message['command'];
                    if(command == "topn"){
                        fillIdCallback(false, message['ids']);
                        console.log(count);
                        count++;
                        busy = false;
                    }
                });
                firstTopN = false;
            }
            //console.log(count);
            //count++;
            pyshell.send({command:"topn",n:topn,id:id});
        }
        //pyshell.send({command:"topn",n:topn,id:id});
        //fillIdCallback(false, "hola");
    };

    async.parallel([
            /*
             * First external endpoint
             */
            function(callback) {
                /*var url = "http://external1.com/api/some_endpoint";
                request(url, function(err, response, body) {
                    // JSON body
                    if(err) { console.log(err); callback(true); return; }
                    obj = JSON.parse(body);

                });*/
                related(1,5,callback);
                //callback(false, "hola");
            },
            /*
             * Second external endpoint
             */
            function(callback) {
                /*var url = "http://external2.com/api/some_endpoint";
                request(url, function(err, response, body) {
                    // JSON body
                    if(err) { console.log(err); callback(true); return; }
                    obj = JSON.parse(body);

                });*/
                callback(false, "hola2");
            },
        ],
        function(err, results) {
            if(err) { console.log(err); res.send(500).body("Server Error"); return; }
            res.send({api1:results[0], api2:results[1]});
            //console.log({api1:results[0], api2:results[1]});
        });
});


