
require('app-module-path').addPath(__dirname + '/../../');

require('./setup');

var app = require('lib/app'),
    request = require('supertest-as-promised');

describe('hello world', function() {
  it('should respond to the root hello path', function() {
    return request(app)
      .get('/hello')
      .expect(200);
  });

  it('should respond to the path', function() {
    return request(app)
      .get('/hello/david')
      .expect(200);
  });
});
