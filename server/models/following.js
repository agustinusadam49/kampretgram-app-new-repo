'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class Following extends Model { }

  Following.init({
    ProfileId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Kolom ProfileId tidak boleh kosong!"
        },
        isInt: {
          args: true,
          msg: "ProfileId harus berupa angka atau integer!"
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
          args: true,
          msg: "Kolom UserId tidak valid!"
        }
      }
    },
    status: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Kolom status tidak boleh kosong!"
        },
        isInt: {
          args: true,
          msg: "Kolom status tidak valid"
        }
      }
    },
    id_delete_follow: DataTypes.INTEGER
  }, { sequelize });
  Following.associate = function (models) {
    // associations can be defined here
    Following.belongsTo(models.Profile);
    Following.belongsTo(models.Users);
  };
  return Following;
};