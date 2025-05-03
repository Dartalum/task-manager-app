'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TaskStatuses', [
      { name: 'new', createdAt: new Date(), updatedAt: new Date() },
      { name: 'in progress', createdAt: new Date(), updatedAt: new Date() },
      { name: 'completed', createdAt: new Date(), updatedAt: new Date() },
      { name: 'сancelled', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TaskStatuses', null, {});
  }
};
