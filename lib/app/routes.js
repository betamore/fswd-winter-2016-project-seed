
var express = require('express');
var app = express.Router();

app.use(function(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated = function isAuthenticated() {
    return !!req.user;
  };
  next();
});

app.get('/', function(req, res) {
  res.render('index');
});

app.use('/user', require('./routes/user'));
app.use('/hello', require('./routes/hello'));

module.exports = app;
