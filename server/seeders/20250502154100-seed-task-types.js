'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TaskTypes', [
      { name: 'creation request', createdAt: new Date(), updatedAt: new Date() },
      { name: 'modification request', createdAt: new Date(), updatedAt: new Date() },
      { name: 'service request', createdAt: new Date(), updatedAt: new Date() },
      { name: 'analysis', createdAt: new Date(), updatedAt: new Date() },
      { name: 'development', createdAt: new Date(), updatedAt: new Date() },
      { name: 'testing', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TaskTypes', null, {});
  }
};
