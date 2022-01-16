'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class Chat extends Model { }

  Chat.init({
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
          msg: "UserId harus berupa angka atau integer!"
        }
      }
    }
  }, { sequelize });
  Chat.associate = function (models) {
    // associations can be defined here
    Chat.belongsTo(models.Profile);
    Chat.belongsTo(models.Users);
    Chat.hasMany(models.Message);
  };
  return Chat;
};