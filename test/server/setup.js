process.env.NODE_ENV = 'test';

var db = require('../../models');

require('chai').should();

beforeEach(function() {
  return db.sequelize.sync({ force: true });
});
