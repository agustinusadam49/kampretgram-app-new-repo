'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class Profile extends Model { }

  Profile.init({
    avatar_url: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Kolom avatar tidak boleh kosong!"
        },
        isUrl: {
          msg: "Alamat Url tidak valid"
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Kolom status tidak boleh kosong!"
        }
      }
    },
    phone_number: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Kolom phone number tidak boleh kosong!"
        },
        isNumeric: {
          msg: "Phone number tidak valid"
        },
        min: {
          args: [0],
          msg: "Minimal input adalah 0"
        },
        max: {
          args: [1000000000000000000000000],
          msg: "Melebihi batas maksimal"
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Kolom UserId tidak boleh kosong!"
        },
        isInt: {
          msg: "UserId tidak valid!"
        }
      }
    }
  }, { sequelize });
  Profile.associate = function (models) {
    // associations can be defined here
    Profile.belongsTo(models.Users);
    Profile.hasMany(models.Following);
    Profile.hasMany(models.Messaging);
  };
  return Profile;
};