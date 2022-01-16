'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class Like extends Model { }

  Like.init({
    PostId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Kolom PostId tidak boleh kosong!"
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
    id_delete: DataTypes.INTEGER
  }, { sequelize });
  Like.associate = function (models) {
    // associations can be defined here
    Like.belongsTo(models.Post);
    Like.belongsTo(models.Users);
  };
  return Like;
};