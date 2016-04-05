'use strict';

var bcrypt = require('bcryptjs');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set: function(val) {
        this.setDataValue('password', bcrypt.hashSync(val));
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
      isValidPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    }
  });
  return User;
};
