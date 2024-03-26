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
      'transactions', // table name
      'package_tracking_numbers', // new field name
      {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'transactions', // table name
      'modified_by', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'transactions', // table name
      'method', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'transactions', // table name
      'receipt_number', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'transactions', // table name
      'is_successful', // new field name
      {
        type: Sequelize.BOOLEAN,
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
