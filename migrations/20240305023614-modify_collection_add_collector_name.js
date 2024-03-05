'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addColumn(
      'collection_requests', // table name
      'collector_first_name', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ), queryInterface.addColumn(
      'collection_requests', // table name
      'collector_last_name', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
      
    ),
    queryInterface.addColumn(
      'collection_requests', // table name
      'collector_email', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'collection_requests', // table name
      'collector_contact', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
