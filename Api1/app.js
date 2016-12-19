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
var Topic        = require('./app/models/topic'); // get the mongoose model
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, skip, limit');

  // Pass to next layer of middleware
  next();
});


// connect to database
mongoose.connect(config.database);

// pass passport for configuration
require('./config/passport')(passport);

// bundle our routes
var apiRoutes = express.Router();

/*
// create a new user account (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password ) {
    res.json({success: false, msg: 'Please fill in all Data( name, password).'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: 301, msg: 'Username, email already exists.'});
      }
      res.json({success: 200, msg: 'Successful created new user.'});
    });
  }
});
*/

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, skip, limit");
  next();
});


// connect the api routes under /api/*
app.use('/api', apiRoutes);

/*
apiRoutes.post('/authenticate', function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: 200, token: 'JWT ' + token});
        } else {
          res.send({success: 401, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
      if (err) throw err;

      if (!user) {
        return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        res.json({success: 200, msg: {"name": user.name}});
      }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});*/



getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

var myCallback = function(data) {
  var newPost = new Post({
    id: data['id'],
    acceptedAnswerId: data['acceptedAnswerId'],
    creationDate: data['creationDate'],
    body: data['body'],
    ownerUserId: data['ownerUserId'],
    closedDate: data['closedDate'],
    title: data['title'],
    tags: data['tags']
  });
  newPost.save(function(err) {
    if (err) {
    }
  });
};

var myCallback2 = function(data) {
  Post.findOne({id: data['ParentId']}, function(err, post) {
    var postMap = {};
    if(post == null) {
    }
    else {
      if (post['acceptedAnswerId'] == data['id']){
        post.bestAnswer = {
          body: data['body'],
          ownerId: data['ownerUserId']
        };
        post.save();
      }
      else {
        post.answers.push({
          body: data['body'],
          ownerId: data['ownerUserId']
        });
        post.save();
      }
    }
  });
};


var myCallback3 = function(data) {
  var newUser = new UserPost({
    id: data['id'],
    displayName: data['displayName'],
  });
  newUser.save(function(err) {
    if (err) {
    }
  });
};

apiRoutes.get('/fillingposts',  function(req, res) {
        /*var parse = require('./app/services/parse');
        console.log('/fillingdatabase before parse');
        parse.parse(myCallback, myCallback2);
        console.log('/fillingdatabase after parse');
        res.json({success: 200, msg: {"message": "Database will be update"}});*/
});

apiRoutes.get('/testfillingdatabase', function(req, res) {
  /*var parse2 = require('./testing/parseTest');
  console.log('/fillingdatabase before parse');
  parse2.parse(myCallback, myCallback2);
  console.log('/fillingdatabase after parse');
  res.json({success: 200, msg: {"message": "Database will be update"}});*/
});

apiRoutes.get('/fillingusers', function(req, res) {
        var parse = require('./app/services/parseUsers');
        parse.parse(myCallback3);
        res.json({success: 200, msg: {"message": "Database will be update"}});
});

//tiquets
apiRoutes.get('/tickets', function(req, res) {

    //req.params.limit //req.params.skip //req.params.close //req.params.open //req.params.dateinit //req.params.dataend //req.params.topicid //req.params.orderdate
    var limit = parseInt("10");
    var skip = parseInt("0");

    var orderdate = parseInt("1");

    var dateinit = "{}";
    var dataend = "{}";
    var topicId = "{}";
    var finalQueryString = "{}";

    //Open, Close
    if((req.query.open == "true") && ((req.query.close == "false") || !req.query.close)) finalQueryString ='{\"acceptedAnswerId\": { \"$exists\": false }}';
    else if((req.query.open == "false" || !req.query.open) && (req.query.close == "true")) finalQueryString ='{\"acceptedAnswerId\": { \"$exists\": true }}';

    //limit, skip
    if(!isNaN(parseInt(req.query.skip))) skip = parseInt(req.query.skip);
    if(!isNaN(parseInt(req.query.limit))) limit = parseInt(req.query.limit);

    //Date
    if(req.query.dateinit) dateinit = "{ \"creationDate\": { \"$gt\": \""+ req.query.dateinit + "\" }}";
    if(req.query.dataend) dataend = "{ \"creationDate\": { \"$lt\": \""+ req.query.dataend + "\" }}";

    //OrderDate
    if(req.query.orderdate && !isNaN(parseInt(req.query.orderdate))) {
        if(parseInt(req.query.orderdate) == -1)  orderdate = -1;
    }

    //TopicId
    if (req.query.topicid) topicId = "{ \"topics\": { \"$elemMatch\": { \"topicid\": " + req.query.topicid + "}}}";

    //ParserFinal
    finalQueryString = "{\"$and\": [" + finalQueryString + ", "+ dateinit +", " + dataend + ", " + topicId + "]}";
    var queryFinal = JSON.parse(finalQueryString);

    Post.find(
        queryFinal
        , {id: 1, title: 1, _id: 0, topics: 1}, function(err, posts) {
            if (err) throw err;
            res.json({success: 200, msg: {"data": posts}});
        }).limit(limit).skip(skip).sort( { creationDate: orderdate } );
});


apiRoutes.get('/ticketsclosed', function(req, res) {
    Post.find({
        acceptedAnswerId: { $exists: true}
    }, {id: 1, title: 1, _id: 0}, function(err, posts) {
        if (err) throw err;
        res.json({success: 200, msg: {"data": posts}});
    }).limit(parseInt(req.headers.limit)).skip(parseInt(req.headers.skip));
});

apiRoutes.get('/ticket/:id', function(req, res) {
  Post.find({
    id: req.params.id
  }, {_id: 0, __v: 0, "answers._id": 0, "tags._id": 0}, function(err, posts) {
    if (err) throw err;
    res.json({success: 200, msg: {"data": posts}});
  });
});

apiRoutes.get('/ticket/:id/related', function(req, res) {
  var callbackCounter = 0;
  var doc2vecCallback = function(data) {
    callbackCounter++;
    if (callbackCounter == 1) {
        var json = [];
        data.forEach(function(postId) {
            json.push(postId);
        });
        Post.find({ id: {$in: data }},{id: 1, title: 1, _id: 0, topics: 1}, function(err, post) {
            if(post.length > 0) {
                res.json({success: 200, msg: {"data": post }});
                res.end();
            }

        });
      if (data.length < 1) res.json({success: 200, msg: {"data": [] }});
        //res.json({success: 200, msg: {"data": [] }});
    }
    else {
        res.end();
    }
  };
  var doc2vec = require('./app/services/doc2vec/doc2vec');
  doc2vec.topn_similar(req.params.id, 20, doc2vecCallback);
});

apiRoutes.get('/ticket/:id/related/users', function(req, res) {
    var callbackCounter = 0;
    var doc2vecCallback = function(data) {
        callbackCounter++;
        if (callbackCounter == 1) {
            var json = [];
            data.forEach(function(postId) {
                json.push(postId);
            });
            Post.find({ id: {$in: data }, acceptedAnswerId: { $exists: true}, "bestAnswer.ownerId": { $exists: true}},{"bestAnswer.ownerId": 1, _id: 0}, function(err, post) {
                if(post.length > 0) {
                    var json = [];
                    post.forEach(function (pot) {
                        json.push(pot["bestAnswer"]["ownerId"]);
                    });
                    UserPost.find({id: {$in: json }}, {_id: 0, __v: 0}, function(err, users){
                        res.json({success: 200, msg: {"data": users}});
                        res.end();
                    });
                }
            });
            if (data.length < 1) res.json({success: 200, msg: {"data": [] }});
        }
        else {
            res.end();
        }
    };
    var doc2vec = require('./app/services/doc2vec/doc2vec');
    try {
        doc2vec.topn_similar(req.params.id, 20, doc2vecCallback);
    }
    catch (e) {

    }

});


//users
apiRoutes.get('/user/:id', function(req, res) {
  UserPost.find({
    id: req.params.id
  }, function(err, user) {
    if (err) throw err;
    res.json({success: 200, msg: {"data": user}});
  });
});

var actualitzaDB = function (DB) {
    console.log(DB);
    DB.forEach(function(entry) {
        Post.findOne({id: entry["id"]}, function(err, post) {
            console.log(post);
            if(post != null) {
                post.set('topics', entry["topic"]);
                post.save();
            }
        });
    });
};

apiRoutes.get('/tickets/doctopic', function (req, res) {
   var chunkSize = 1000;
   var lda = require('./app/services/lda/lda');
   var currentIds = [];

   var queryDB = function (chunk) {
       Post.find({},{id:1, body:1}, function(err, posts){
           // Fill data to send
           var dataSend = {op:'run', posts:[]};
           for (var i = 0; i < posts.length; i++) {
               dataSend.posts.push(posts[i]['body']);
               currentIds.push(posts[i]['id'])
           }

           // Check the result of the query
           if(posts.length > 0)
               lda.topicsOfDocs(dataSend, ldaCallback);
           else
               lda.topicsOfDocs({op:'finish'}, ldaCallback);
       }).skip(chunk*chunkSize).limit(chunkSize);
   };

   var ldaCallback = function(resp) {
       // Update the data base
       var dataToUpdate = [];
       var topics = resp['posts'];
       for (var i = 0; i < currentIds.length; i++) {
           var tmp = [];
           for (var j = 0; j < topics[i].length; j++)
                tmp.push({topicid:topics[i][j][0], topicvalue:topics[i][j][1]});
           dataToUpdate.push({id: currentIds[i], topic: tmp});
       }
       actualitzaDB(dataToUpdate);

       // Send data of chunk
       var chunk = resp['chunk'];
       currentIds = [];
       queryDB(chunk);
   };
    queryDB(0);
    res.json({success: 200, msg: {"data": "ok"}});
});


apiRoutes.get('/tickets/topics/save', function (req, res) {
    var lda = require('./app/services/lda/lda');

    var ldaCallback = function(resp){
        // get topics data
        /*resp[0].forEach(function(item) {
            console.log("---------------");
            console.log(item);
            console.log("---------------");
        });*/
        /*var newTopic = new Topic({
            id: data['id'],
            name: data['displayName'],
            palabras: data['palabras']
        });
        newTopic.save(function(err) {
            if (err) {
            }
        });*/
        /*console.log(resp['topic0']);
        console.log(resp['topic1']);
        console.log(resp['topic2']);
        console.log(resp['topic3']);
        console.log(resp['topic4']);
        console.log(resp['topic5']);
        console.log(resp['topic6']);
        console.log(resp['topic7']);
        console.log(resp['topic8']);
        console.log(resp['topic9']);*/
        console.log(resp);
    };
    lda.getTopicsModel(ldaCallback);
    res.json({success: 200, msg: {"data": "ok"}});

});

apiRoutes.get('/tickets/topics', function (req, res) {
    Topic.find({
    }, function(err, user) {
        if (err) throw err;
        res.json({success: 200, msg: {"data": user}});
    });
});

apiRoutes.get('/tickets/topics/:id', function (req, res) {
    Topic.find({
        id: req.params.id
    }, function(err, user) {
        if (err) throw err;
        res.json({success: 200, msg: {"data": user}});
    });
});

apiRoutes.get('/tickets/deletetopics', function (req, res) {
    var lda = require('./app/services/lda/lda');

    var ldaCallback = function(resp){
        // get topics data
        console.log(resp);
    };
    lda.deleteModel(ldaCallback);
    res.json({success: 200, msg: {"data": "ok"}});

});

apiRoutes.get('/tickets/createtopics', function (req, res) {
    var chunkSize = 10000;
    var lda = require('./app/services/lda/lda');

    var queryDB = function (chunk) {
        Post.find({},{body:1}, function(err, posts){
            // Fill data to send
            var dataSend = {op:'run', posts:[]};
            for (var i = 0; i < posts.length; i++)
                dataSend.posts.push(posts[i]['body']);

            // Check the result of the query
            if(posts.length > 0)
                lda.createModel(dataSend, ldaCallback);
            else
                lda.createModel({op:'finish'}, ldaCallback);
        }).skip(chunk*chunkSize).limit(chunkSize);
    };

    var ldaCallback = function(resp){
        // print response
        console.log(resp);
        // Send data of chunk
        var chunk = resp['chunk'];
        queryDB(chunk);
    };
    queryDB(0);
    res.json({success: 200, msg: {"data": "ok"}});
});
