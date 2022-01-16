'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Posts", "image_file", Sequelize.BLOB);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Posts", "image_file");
  }
};
