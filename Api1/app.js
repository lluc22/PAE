var express     = require('express');
var extend = require('util')._extend;
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./app/models/user'); // get the mongoose model
var Post        = require('./app/models/post'); // get the mongoose model
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


// connect to database
mongoose.connect(config.database);

// pass passport for configuration
require('./config/passport')(passport);

// bundle our routes
var apiRoutes = express.Router();

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
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// connect the api routes under /api/*
app.use('/api', apiRoutes);

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
});



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
  /*Post.insert({
    id: data['id'],
    creationDate: data['creationDate'],
    body: data['body'],
    ownerUserId: data['ownerUserId'],
    closedDate: data['closedDate'],
    title: data['title'],
    tags: data['tags']
  });*/
  var newPost = new Post({
    id: data['id'],
    creationDate: data['creationDate'],
    body: data['body'],
    ownerUserId: data['ownerUserId'],
    closedDate: data['closedDate'],
    title: data['title'],
    tags: data['tags']
  });
  // save the user
  newPost.save(function(err) {
    if (err) {
      //console.log('Error when save new Post');
    }
  });
};

var myCallback2 = function(data) {
  Post.findOne({id: data['ParentId']}, function(err, post) {
    var postMap = {};
    if(post == null) {
      //console.log('No parent id Found: ');
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
  //console.log(data);

  //console.log('=========================');
};

apiRoutes.get('/fillingdatabase', /*passport.authenticate('jwt', { session: false}), */ function(req, res) {
  /*var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
      if (err) throw err;

      if (!user) {
        return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
      } else { */
        var parse = require('./app/services/parse');
        console.log('/fillingdatabase before parse');
        parse.parse(myCallback, myCallback2);
        console.log('/fillingdatabase after parse');
        res.json({success: 200, msg: {"message": "Database will be update"}});
      /*}
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
  */
});

//tiquets
apiRoutes.get('/tickets'/*, passport.authenticate('jwt', { session: false})*/, function(req, res) {
  /*var token = getToken(req.headers);
  //if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
      if (err) throw err;

      if (!user) {
        return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {*/
        Post.find({
          acceptedAnswerId: { $exists: false}
        }, {id: 1, title: 1}, function(err, posts) {
          if (err) throw err;
          var result = [];
            posts.forEach(function (item) {
                result.push({id : item['id'], title: item['title']});
            })
            //console.log(result);
          res.json({success: 200, msg: {"data": result}});
        }).limit(15);
      /*}
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }*/
});