
require('app-module-path').addPath(__dirname + '../');

var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

var app = express();

app.set('view engine', 'jade');
app.set('views', './views');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('./app/routes'));

module.exports = app;
