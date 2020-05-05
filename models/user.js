'use strict';

const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address'
        }
      }
    }, 
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide your name'
        }
      }
    }, 
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8,32],
          msg: 'Your password should be between 8 and 32 characters'
        }
      }
    } 
  }, {
    hooks: {
      beforeCreate: (pendingUser) => {
        if(pendingUser && pendingUser.password) {
          //hash password with BCrypt
          let hash = bcrypt.hashSync(pendingUser.password, 12);

          //reassign user's password to the has version
          pendingUser.password = hash;
        }
      }
    }
  });
  user.associate = function(models) {
    // associations can be defined here
    models.user.belongsToMany(models.song, {through: "usersongs"})
    models.user.belongsToMany(models.artist, {through: "userartists"})
  };

//custom function: validPassword
//this will check an instance of the model (a specific user) against a type in password
//use bcrypt to compare hashes
user.prototype.validPassword = function(typedInPassword) {
  return bcrypt.compareSync(typedInPassword, this.password);
}


  return user;
};

