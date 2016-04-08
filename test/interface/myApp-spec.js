describe('myApp', function() {
  beforeEach(function() {
    require('myApp');
  });
  it('should be defined', function() {
    angular.module('fswd-2016').should.be.defined;
  });
});
