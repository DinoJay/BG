// Import required modules.
var express = require('express');
var stormpath = require('express-stormpath');
var path = require('path');

// Initialize our Express app.
var app = express();
app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'jade');

// Configure Stormpath.
app.use(stormpath.init(app, {
  apiKeyId:     process.env.STORMPATH_API_KEY_ID,
  apiKeySecret: process.env.STORMPATH_API_KEY_SECRET,
  secretKey:    process.env.STORMPATH_SECRET_KEY,
  application:  process.env.STORMPATH_URL,
  //views
  registrationView: __dirname + '/pages/register.jade',
  loginView: __dirname + '/pages/login.jade',
}));

app.use(require('less-middleware')(__dirname + '/public'));
app.use(express.static(path.join(__dirname, '/public')));

// Generate a simple home page.
app.get('/', function(req, res) {
  res.render('index', {title: 'Home', user: req.user});
});

// Generate a simple dashboard page.
app.get('/dashboard', stormpath.loginRequired, function(req, res) {
  res.send('Hi: ' + req.user.email + '. Logout <a href="/logout">here</a>');
});

// Listen for incoming requests and serve them.
app.listen(app.get('port'), function (err) {
  console.log("Server started; listening on port " + app.get('port'));
});
