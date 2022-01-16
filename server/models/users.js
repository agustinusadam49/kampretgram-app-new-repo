'use strict';
const { generatePassword } = require("../helpers/bcrypt");

module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class Users extends Model { }

  Users.init({
    full_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Kolom full name tidak boleh kosong!"
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Kolom username tidak boleh kosong!"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Kolom email tidak boleh kosong!"
        },
        isEmail: {
          msg: "Email tidak valid!"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Kolom Password tidak boleh kosong"
        }
      }
    },
    is_online: DataTypes.INTEGER
  }, { sequelize });

  Users.beforeCreate((users, options) => {
    users.password = generatePassword(users.password);
    users.is_online = 1;
  })

  Users.associate = function (models) {
    // associations can be defined here
    Users.hasOne(models.Profile);
    Users.hasMany(models.Post);
    Users.hasMany(models.Comment);
    Users.hasMany(models.Like);
    Users.hasMany(models.Following);
    Users.hasMany(models.Notification);
    Users.hasMany(models.Messaging);
  };
  return Users;
};