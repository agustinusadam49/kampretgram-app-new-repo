'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class Comment extends Model { }

  Comment.init({
    PostId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Kolom PostId tidak boleh kosong",
        },
        isInt: {
          args: true,
          msg: "PostId harus berupa angka atau integer!"
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
    comments: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Kolom comments tidak boleh kosong!"
        }
      }
    }
  }, { sequelize });
  Comment.associate = function (models) {
    // associations can be defined here
    Comment.belongsTo(models.Post);
    Comment.belongsTo(models.Users);

  };
  return Comment;
};