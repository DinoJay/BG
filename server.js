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

var options = { server: { socketOptions: { keepAlive: 1, 
  connectTimeoutMS: 30000 } }, 
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 }}};
var mongodbUri = 'mongodb://heroku_app31182773:ccg276p6c72givh103mjv6j'+
                 'sr9@ds051170.mongolab.com:51170/heroku_app31182773';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri, options);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

// Create song schema
var tasksSchema = mongoose.Schema({
  name: String,
  completed: Boolean,
});
var eventSchema = mongoose.Schema({
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
var taskModel = mongoose.model('tasks', tasksSchema);
var eventModel = mongoose.model('events', eventSchema);

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
// TODO: add csrf here

// export db to all middlewares
app.use(function(req, res, next) {
  req.db = {};
  req.db.tasks = db.collection('tasks');
  req.db.model = eventModel;
  next();
});

// When there’s a request that matches route/RegExp with :task_id in it, 
// this block is executed:
app.param('task_id', function(req, res, next, taskId) {
  req.db.model.findById(taskId, function(error, task){
    if (error) return next(error);
    if (!task) return next(new Error('Task is not found.'));
      req.task = task;
    return next();
  });
});

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


// Generate a simple home page.
app.get('/', function(req, res) {
  res.render('index', {title: 'Home', user: req.user});
});

// Generate a simple dashboard page.
app.get('/dashboard', stormpath.loginRequired, function(req, res) {
  res.render('dashboard', {});
  //res.send('Hi: ' + req.user.email + '. Logout <a href="/logout">here</a>');
});

app.get('/tours', stormpath.loginRequired, function(req, res) {
  res.render('tours', {});
  //res.send('Hi: ' + req.user.email + '. Logout <a href="/logout">here</a>');
});
app.get('/tours/list', function(req, res, next){
  req.db.model.find({
    user: req.user.username
  }, function(error, events){
    console.log("found events:");
    console.log(events);
    res.send(events);
  });
});
app.put('/tours/register', function(req, res, next){
  if (!req.body) 
    return next(new Error('No data provided.'));
  console.log(req.body);
  req.db.model.findOneAndUpdate({
    user: req.user.username
  }, {$push: {reg_users: req.user.username} }, function (err, doc){
  console.log(err);
  console.log(doc);
  console.log("SUCCESS");
  });
});

app.get('/route', stormpath.loginRequired, function(req, res) {
  res.render('route', {});
  //res.send('Hi: ' + req.user.email + '. Logout <a href="/logout">here</a>');
});
app.put('/route', stormpath.loginRequired, function(req, res, next){
  res.send('Magic over here');
  console.log(req.body);

  //var Event = req.db.model;
  var event = new eventModel({
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

  event.save(function(error, event){
    if (error) return next(error);
    if (!event) return next(new Error('Failed to save.'));
    console.info('Added %s with id=%s', event, event._id);
    //res.redirect('/tasks');
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
