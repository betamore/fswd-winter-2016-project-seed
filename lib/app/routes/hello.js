
var express = require('express');

var app = express.Router();

app.get('/', function(req, res) {
  res.end('');
});

app.get('/:name', function(req, res) {
  res.end('Hello ' + req.params.name);
});

module.exports = app;
