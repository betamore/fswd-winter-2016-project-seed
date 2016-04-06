var angular = require('./lib/angular');

var myApp = angular.module('fswd-2016', [
  require('./lib/angular-route').name
]);

module.exports = myApp;
