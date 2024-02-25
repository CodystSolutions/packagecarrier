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
      'requests', // table name
      'sender_first_name', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'requests', // table name
      'sender_last_name', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    )
    queryInterface.addColumn(
      'requests', // table name
      'sender_info', // new field name
      {
        type: Sequelize.JSONB,
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
