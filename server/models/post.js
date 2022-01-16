'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class Post extends Model { }

  Post.init({
    caption: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Kolom caption tidak boleh kosong!"
        }
      }
    },
    image_url: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Kolom image url tidak boleh kosong!"
        },
        isUrl: {
          msg: "Kolom image url harus berupa url"
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Kolom UserId tidak boleh kosong"
        },
        isInt: {
          msg: "UserId tidak valid"
        }
      }
    },
    like: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Kolom like tidak boleh kosong!"
        },
        isInt: {
          args: true,
          msg: "Data like tidak valid!"
        }
      }
    },
    dis_like: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Kolom dis like tidak boleh kosong!"
        },
        isInt: {
          args: true,
          msg: "Data dis like tidak valid!"
        }
      }
    },
    image_file: DataTypes.BLOB
  }, { sequelize });

  Post.associate = function (models) {
    // associations can be defined here
    Post.belongsTo(models.Users);
    Post.hasMany(models.Comment);
    Post.hasMany(models.Like);
    Post.hasMany(models.Notification);
  };
  return Post;
};