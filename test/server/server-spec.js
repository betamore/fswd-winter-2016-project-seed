
'use strict';
require('app-module-path').addPath(__dirname + '/../../');

require('./setup');

var app = require('lib/app'),
    request = require('supertest-as-promised');

describe('server', function() {
  it('should respond to the root path', function() {
    return request(app)
      .get('/')
      .expect(200);
  });
});
