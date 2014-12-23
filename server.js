// Import required modules.
var express = require('express');
var stormpath = require('express-stormpath');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('express-favicon');
var mongoskin = require('mongoskin');
var CryptoJS = require("crypto-js");
var nodejsx     = require('node-jsx').install();
var development = process.env.MODE !== 'production';

// route helper
var tours = require('./routes/tourRoute.js');
var comments = require('./routes/commentRoute.js');

// client code bundling
var webpackMiddleware = require('webpack-dev-middleware');
var webpack = require('webpack');

var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');

var options = {
  server: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS : 30000
    }
  }
};
var mongodbUri = 'mongodb://heroku_app31182773:ccg276p6c72givh103mjv6j'+
                 'sr9@ds051170.mongolab.com:51170/heroku_app31182773';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri, options);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

// Create song schema
var commentSchema = mongoose.Schema({
  user: String,
  datetime: Date,
  text: String,
  tourId: Object
});
var tourSchema = mongoose.Schema({
    name       : String,
    origin     : String,
    dest       : String,
    start_date : String,
    end_date   : String,
    pers       : String,
    difficulty : Number,
    descr      : String,
    route      : Object,
    user       : String,
    reg_users  : Array,
    tags       : Array
});

// Store song documents in a collection called "songs"
var commentModel = mongoose.model('comments', commentSchema);
var tourModel = mongoose.model('tours', tourSchema);

// Initialize our Express app.
var app = express();
app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'jade');

// access appname within every jade template
app.locals.appname = 'Biking Guider';

// TODO
//app.use(favicon());
app.use(logger('dev'));

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser({
  limit: '5mb',
}));
app.use(bodyParser.json());

//Lets you use HTTP verbs such as PUT or DELETE in places where the
//client doesn't support it.
app.use(methodOverride());
app.use(cookieParser());

app.param('tourId', function(req, res, next, tourId) {
  req.tourId = tourId;
  next();
});
app.param('userId', function(req, res, next, userId) {
  req.userId = userId;
  next();
});
// expose models to the request object
app.use(function(req, res, next) {
  req.db = {};
  req.db.tourModel = tourModel;
  req.db.commentModel = commentModel;
  next();
});

/*
var sessionMiddleware = session({
  store: new RedisStore(options),
  secret: 'asdklasdkjsadksadlökfsdkpä',
});
app.use(sessionMiddleware);
*/

// less to css transformer
app.use(require('less-middleware')(__dirname + '/public'));
app.use(express.static(path.join(__dirname, '/public')));

if (development){
  app.use(webpackMiddleware(webpack({
    entry: {
      dashboard: path.join(__dirname, 'scripts/dashboard.jsx'),
      tours: path.join(__dirname, 'scripts/tours.jsx'),
      route: path.join(__dirname, 'scripts/route.jsx')
    },
    output: {
      path: '/',
      filename: '[name].bundle.js',
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      loaders: [
        { test: /\.jsx$/, loader: "jsx" }
      ]
    }
  }),
  {
    stats: {
      colors: true
    }
  }));
}

// Configure Stormpath.
app.use(stormpath.init(app, {
  // TODO: but there is session enabled by stormpath
  //sessionMiddleware: sessionMiddleware,
  apiKeyId:     process.env.STORMPATH_API_KEY_ID,
  apiKeySecret: process.env.STORMPATH_API_KEY_SECRET,
  secretKey:    process.env.STORMPATH_SECRET_KEY,
  application:  process.env.STORMPATH_URL,
  expandCustomData: true,

  postRegistrationHandler: function(account, res, next) {
    console.log('User:', account, 'just registered!');
    res.locals.user.customData.joined = (new Date()
                                     .toLocaleDateString("en-US"));
    res.locals.user.save();
    next();
  },
  //views
  registrationView: __dirname + '/pages/register.jade',
  loginView: __dirname + '/pages/login.jade',
  redirectUrl: '/dashboard',
}));

// home page.
app.get('/', function(req, res) {
  res.render('index', {title: 'Home', user: req.user});
});

app.get('/getUsername', function(req, res) {
  res.send({user:req.user.username});
});

// Generate a simple dashboard page.
app.get('/dashboard', stormpath.loginRequired, function(req, res) {
  res.locals.user.customData.lastSeen = (new Date()
                                          .toLocaleDateString("en-US"));
  res.locals.user.save();
  //console.log(res.locals.user);
  var hash = CryptoJS.MD5(req.user.username);

  var gravatarLink = 'http://www.gravatar.com/avatar/'+hash;
  req.db.tourModel.find({user: req.user.username}).count(
    function(err, countCreated){
      if (err) return handleError(err);
      console.log("Count", countCreated);
      console.log(req.userId);
      req.db.tourModel.find({reg_users: req.user.username})
        .count(function(error, countRegistered){
          console.log("Count Registered", countRegistered);
                              res.render('dashboard', {
                                title: 'dashboard',
                                user: res.locals.user,
                                gravatarLink: gravatarLink,
                                countCreated: countCreated,
                                countRegistered: countRegistered
                              });
                            });
  });
});

app.get('/tours', stormpath.loginRequired, function(req, res) {
  res.render('tours', {title: "tours"});
});

app.get('/user', function(req, res, next){
   res.send({
      user: req.user.username,
    });
});

app.get('/tours/list', tours.list);
app.get('/tours/listAll', tours.listAll);
app.get('/tours/list/:userId', tours.listRegTours);
app.put('/tours/register', tours.register);
app.put('/tours/change/:tourId', tours.change);
app.del('/tours/delete/:tourId', tours.del);
app.del('/tours/reg_users/:tourId', tours.deleteRegUser);

app.get('/tours/comments/:tourId', comments.list);
app.put('/tours/comments/:tourId', comments.add);

app.get('/route', stormpath.loginRequired, function(req, res) {
  res.render('route', {title: 'route'});
});
app.put('/route/create', stormpath.loginRequired, tours.create);

// Listen for incoming requests and serve them.
app.listen(app.get('port'), function (err) {
  console.log("Server started; listening on port " + app.get('port'));
  console.log('Point your browser to http://localhost:'+app.get('port'));
});
