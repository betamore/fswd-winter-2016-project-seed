
var express = require('express');
var app = express.Router();

app.get('/', function(req, res) {
  res.render('index');
});

app.use('/user', require('./routes/user'));
app.use('/hello', require('./routes/hello'));

module.exports = app;
