'use strict';

require('app-module-path').addPath(__dirname + '/../../');

// load the common test setup code
require('./setup');

// code to test
var app = require('lib/app');

// libraries
var request = require('supertest-as-promised').agent,
  agent;

var User = require('../../models').User;

describe('users', function() {
  beforeEach(function() {
    agent = request(app);
  });

  describe('registration', function() {
    it('should have a registration page', function() {
      return agent
        .get('/user/register')
        .expect(200)
    });

    it('should log the new user in', function() {
      return agent
        .post('/user/register')
        .type('form')
        .send({
          username: 'myNewUsername',
          password: 'myFancyPassword',
          password_confirm: 'myFancyPassword'
        })
        .expect(302)
        .expect('Location', '/')
        .then(function() {
          return agent
            .get('/')
            .expect(200, /Hello myNewUsername!/);
          });
    });

    it('should not allow registration if passwords do not match', function() {
      return agent
        .post('/user/register')
        .type('form')
        .send({
          username: 'myNewUsername',
          password: 'myFancyPassword',
          password_confirm: 'myOtherFancyPassword'
        })
        .expect(200, /Passwords must match/);
    });

    describe('when a user already exists', function() {
      var existingUser;
      beforeEach(function() {
        return User.create({ username: 'PreExistingUser', password: 'TheirPassword' })
          .then(function(user) {
            existingUser = user;
          });
      });

      it('should not allow registration of an existing username', function() {
        return agent
          .post('/user/register')
          .type('form')
          .send({
            username: existingUser.username,
            password: 'password',
            password_confirm: 'password'
          })
          .expect(200, /User already exists/);
      });

      it('should tell us the username is not avaialble', function() {
        return agent
          .get('/user/available')
          .query({ username: existingUser.username })
          .expect(200, { available: false });
      });

      it('should tell us that another username is available', function() {
        return agent
          .get('/user/available')
          .query({ username: existingUser.username + "new" })
          .expect(200, { available: true });
      });
    });
  });

  describe('login', function() {
    it('should have a login page', function() {
      return agent
        .get('/user/login')
        .expect(200);
    });

    it('should not login when there are no users', function() {
      return agent
        .post('/user/login')
        .type('form')
        .send({
          username: 'someUsername',
          password: 'somePassword'
        })
        .expect(200, /User not found/)
        .then(function() {
          return agent
            .post('/user/login')
            .set('Accept', 'application/json')
            .send({
              username: 'someUsername',
              password: 'somePassword'
            })
            .expect(401, { error: 'User does not exist' });
        });
    });

    describe('when there are users', function() {
      beforeEach(function(done) {
        User.create({ username: 'PreExistingUser', password: 'TheirPassword' })
        .then(function() {
          done();
        });
      });

      describe('for a form login', function() {
        it('should login the user', function() {
          return agent
            .post('/user/login')
            .type('form')
            .send({
              username: 'PreExistingUser',
              password: 'TheirPassword'
            })
            .expect(302)
            .expect('Location', '/')
            .then(function() {
              return agent
                .get('/')
                .expect(200, /Hello PreExistingUser!/);
            });
        });

        it('should warn the user about incorrect passwords', function() {
          return agent
            .post('/user/login')
            .type('form')
            .send({
              username: 'PreExistingUser',
              password: 'myOtherFancyPassword'
            })
            .expect(200, /Password incorrect/);
        });
      });

      describe('for an API login', function() {
        it('should login the user', function() {
          return agent
            .post('/user/login')
            .set('Accept', 'application/json')
            .send({
              username: 'PreExistingUser',
              password: 'TheirPassword'
            })
            .expect(200, { success: true })
            .then(function() {
              return agent
                .get('/')
                .expect(200, /Hello PreExistingUser!/);
            });
        });

        it('should warn the user about incorrect passwords', function() {
          return agent
            .post('/user/login')
            .set('Accept', 'application/json')
            .send({
              username: 'PreExistingUser',
              password: 'myOtherFancyPassword'
            })
            .expect(401, { error: 'Password incorrect' });
        });
      });
    });
  });
});
