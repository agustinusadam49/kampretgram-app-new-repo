'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class Messaging extends Model { }

  Messaging.init({
    ProfileId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Kolom ProfileId tidak boleh kosong!"
        },
        isInt: {
          args: true,
          msg: "ProfileId harus berupa angka atau data integer!"
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
          msg: "Kolom UserId harus berupa angka atau data integer!"
        }
      }
    },
    chats: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Kolom Chats tidak boleh kosong!"
        }
      }
    },
    read: DataTypes.BOOLEAN
  }, { sequelize });

  Messaging.beforeCreate((messagings, options) => {
    messagings.read = false;
  })

  Messaging.associate = function (models) {
    // associations can be defined here
    Messaging.belongsTo(models.Profile);
    Messaging.belongsTo(models.Users);
  };
  return Messaging;
};