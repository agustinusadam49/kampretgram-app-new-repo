'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class Follow extends Model { }

  Follow.init({
    user_followed_by: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Kolom user followed by tidak boleh kosong!"
        },
        isInt: {
          args: true,
          msg: "User Followed By harus berupa angka atau integer!"
        }
      }
    },
    user_follow_to: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Kolom user follow to tidak boleh kosong!"
        },
        isInt: {
          args: true,
          msg: "User Follow To harus berupa angka atau integer!"
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
          msg: "Status harus berupa angka atau integer!"
        }
      }
    },
    id_follow_delete: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Kolom id follow delete tidak boleh kosong!"
        },
        isInt: {
          args: true,
          msg: "Id follow delete harus berupa angka atau integer!"
        }
      }
    }
  }, { sequelize });
  Follow.associate = function (models) {
    // associations can be defined here
    // Follow.belongsTo(models.Users);
  };
  return Follow;
};