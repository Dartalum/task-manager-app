'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('UserRoles', [
      { name: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'user', createdAt: new Date(), updatedAt: new Date() },
      { name: 'executor', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UserRoles', null, {});
  }
};
