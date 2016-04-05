
var express = require('express');
var app = express.Router();

var User = require('../../../models').User;

app.get('/login', function(req, res) {
  res.render('user/login');
});

app.post('/login', function(req, res) {
  User.findOne({ where: { username: req.body.username } })
    .then(function(user) {
      res.format({
        html: function() {
          if (!user) {
            res.end('User not found');
          } else if (user.isValidPassword(req.body.password)) {
            req.session.user_id = user.id;
            req.session.save(function() {
              res.redirect('/');
            });
          } else {
            res.end('Password incorrect');
          }
        },
        json: function() {
          if (!user) {
            res.status(401).json({ error: 'User does not exist' });
          } else if (user.isValidPassword(req.body.password)) {
            req.session.user_id = user.id;
            req.session.save(function() {
              res.json({ success: true });
            });
          } else {
            res.status(401).json({ error: 'Password incorrect' });
          }
        }
      })
    });
});

app.get('/register', function(req, res) {
  res.render('user/register');
});

app.post('/register', function(req, res) {
  if (req.body.password !== req.body.password_confirm) {
    res.end('Passwords must match');
  } else {
    User.findOne({ where: { username: req.body.username }})
      .then(function(existingUser) {
        if (existingUser) {
          res.end('User already exists');
        } else {
          User.create(req.body).then(function(user) {
            req.session.user_id = user.id;
            req.session.save(function() {
              res.redirect('/');
            })
          });
        }
      });
  }
});

app.get('/available', function(req, res) {
  User.findOne({ where: { username: req.query.username }})
    .then(function(user) {
      res.json({ available: !user });
    });
});

module.exports = app;
