'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set: function(val) {
        this.setDataValue('password', bcrypt.hashSync(val, 8));
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
    },
    hooks: {
      // see http://docs.sequelizejs.com/en/latest/docs/hooks/
      beforeCreate: function(user) {
        // perform any operations on a user before
        // they are created in the database
        console.log('User to be created: ' + user.username);
      },
      afterCreate: function(user) {
        console.log('User "' + user.username + '" created with id ' + user.id);
      }
    }
  });
  return User;
};
