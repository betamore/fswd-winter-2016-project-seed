
var express = require('express');
var app = express.Router();

app.post('/new', function(req, res) {
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
});

module.exports = app;
