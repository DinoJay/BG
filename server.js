// Import required modules.
var express = require('express');
var stormpath = require('express-stormpath');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var nodejsx     = require('node-jsx').install();

var development = process.env.MODE !== 'production';

// client code bundling
var webpackMiddleware = require('webpack-dev-middleware');
var webpack = require('webpack');

var routes = require('./routes');
var tasks = require('./routes/tasks');
var todo = require('./routes/todo');
var logger = require('morgan');
var favicon = require('express-favicon');
var mongoskin = require('mongoskin');

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
    reg_users  : Array
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
app.use(session({
  secret: 'asdkasdksadodeiwjeof' , 
  key: 'sid',
  cookie: {secure: false},
  saveUninitialized: true,
  resave: true
}));

// less to css transformer
app.use(require('less-middleware')(__dirname + '/public'));
app.use(express.static(path.join(__dirname, '/public')));

if (development){
  app.use(webpackMiddleware(webpack({
      // webpack options
      // webpackMiddleware takes a Compiler object as first parameter
      // which is returned by webpack(...) without callback.
    entry: {
      dashboard: path.join(__dirname, 'scripts/dashboard.jsx'),
      tours: path.join(__dirname, 'scripts/tours.jsx'),
      route: path.join(__dirname, 'scripts/route.jsx')
    },
    output: {
        path: '/',
        filename: '[name].bundle.js',
        // no real path is required, just pass "/"
        // but it will work with other paths too.
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      loaders: [
            { test: /\.jsx$/, loader: "jsx" }
      ]
    }
  }
  ),
  {
    stats: {
      colors: true
    }
  }));
}

// Configure Stormpath.
app.use(stormpath.init(app, {
  apiKeyId:     process.env.STORMPATH_API_KEY_ID,
  apiKeySecret: process.env.STORMPATH_API_KEY_SECRET,
  secretKey:    process.env.STORMPATH_SECRET_KEY,
  application:  process.env.STORMPATH_URL,
  //views
  registrationView: __dirname + '/pages/register.jade',
  loginView: __dirname + '/pages/login.jade',
  // redirects
  // TODO: change this later
  redirectUrl: '/tours',
}));

app.param('tourId', function(req, res, next, tourId) {
  req.tourId = tourId;
  next();
});

// Generate a simple home page.
app.get('/', function(req, res) {
  res.render('index', {title: 'Home', user: req.user});
});

// Generate a simple dashboard page.
app.get('/dashboard', stormpath.loginRequired, function(req, res) {
  res.render('dashboard', {});
});

app.get('/tours', stormpath.loginRequired, function(req, res) {
  res.render('tours', {});
});
app.get('/tours/list', function(req, res, next){
  // TODO: find not by registered user
  tourModel.find({}, function(error, tours){
    console.log("found tours:");
    //console.log(tours);
    res.send({
      user: req.user.username,
      tours: tours
    });
  });
});
app.put('/tours/register', function(req, res, next){
  if (!req.body) 
    return next(new Error('No data provided.'));

    tourModel.findById(req.body._id, function (err, doc){
    if (!err) {
      if (doc.reg_users.indexOf(req.user.username) !== -1) {
        doc.reg_users.push(req.user.username);
        doc.save();
        res.send("success");
      } else {
        res.send("failure");
      }
    } else console.log(err);
  });
});

app.get('/tours/comments/:tourId', function(req, res, next){
  console.log(req.tourId);
  commentModel.find({$query: { tourId: req.tourId }, 
                    $orderby:{datetime:1}}, function(error, comments){
    if (error) console.log(error);
    console.log("found comments:");
    console.log(comments);
    res.send({
      comments: comments
    });
  });
});
app.put('/tours/comments/:tourId', function(req, res, next){
  if (!req.body) return next(new Error('No data provided.'));
  var comment = new commentModel({
    user : req.user.username,
    text : req.body.comment.text,
    datetime : Date(),
    tourId: req.tourId
  });
  comment.save(function(error, tour){
    if (error) return next(error);
    if (!tour) return next(new Error('Failed to save.'));
    console.info('Added %s with id=%s', tour, tour._id);

    commentModel.find({$query: { tourId: req.tourId }, 
                      $orderby:{datetime:1}},
                                         function(error, comments){
      if (error) console.log(error);
      console.log("comments to send:");
      console.log(comments);
      res.send({
        comments: comments
      });
    });
  });
});

app.get('/route', stormpath.loginRequired, function(req, res) {
  res.render('route', {});
});
app.put('/route/create',
        stormpath.loginRequired, function(req, res, next){

  var tour = new tourModel({
    name       : req.body.name,
    origin     : req.body.origin,
    dest       : req.body.dest,
    start_date : req.body.end_date,
    end_date   : req.body.start_date,
    pers       : req.body.pers,
    difficulty : req.body.difficulty,
    descr      : req.body.descr,
    route      : req.body.route,
    user       : req.user.username,
  });
  if (!req.body) 
    return next(new Error('No data provided.'));

  tour.save(function(error, tour){
    if (error) return next(error);
    if (!tour) return next(new Error('Failed to save.'));
    console.info('Added %s with id=%s', tour, tour._id);
  });
});

app.get('/tasks', tasks.list);
app.post('/tasks', tasks.markAllCompleted);
app.post('/tasks', tasks.add);
app.post('/tasks/:task_id', tasks.markCompleted);
app.delete('/tasks/:task_id', tasks.del);
app.get('/tasks/completed', tasks.completed);

// Listen for incoming requests and serve them.
app.listen(app.get('port'), function (err) {
  console.log("Server started; listening on port " + app.get('port'));
  console.log('Point your browser to http://localhost:'+app.get('port'));
});
