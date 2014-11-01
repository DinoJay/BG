// Import required modules.
var express = require('express');
var stormpath = require('express-stormpath');

// Initialize our Express app.
var app = express();

// Configure Stormpath.
app.use(stormpath.init(app, {
  apiKeyId:     process.env.STORMPATH_API_KEY_ID,
  apiKeySecret: process.env.STORMPATH_API_KEY_SECRET,
  secretKey:    process.env.STORMPATH_SECRET_KEY,
  application:  process.env.STORMPATH_URL,
}));

// Generate a simple home page.
app.get('/', function(req, res) {
  res.send("Hey NNILS there! Thanks for visting the site!"+
           "Be sure to <a href='/login'>login</a>!");
});

// Generate a simple dashboard page.
app.get('/dashboard', stormpath.loginRequired, function(req, res) {
  res.send('Hi: ' + req.user.email + '. Logout <a href="/logout">here</a>');
});

// Listen for incoming requests and serve them.
app.listen(process.env.PORT || 3000);
