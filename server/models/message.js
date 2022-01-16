'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class Message extends Model { }

  Message.init({
    ChatId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Kolom ChatId tidak boleh kosong!"
        },
        isInt: {
          args: true,
          msg: "ChatId harus berupa angka atau integer!"
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
    },
    messages: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Kolom messages tidak boleh kosong!"
        }
      }
    }
  }, { sequelize });
  Message.associate = function (models) {
    // associations can be defined here
    Message.belongsTo(models.Chat);
    Message.belongsTo(models.Users);
  };
  return Message;
};