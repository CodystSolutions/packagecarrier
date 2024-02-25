'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'packages', // table name
        'sender_first_name', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'packages', // table name
        'sender_last_name', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'packages', // table name
        'sender_email', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'packages', // table name
        'sender_contact', // new field name
        {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'packages', // table name
        'receiver_first_name', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'packages', // table name
        'receiver_last_name', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'packages', // table name
        'receiver_email', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'packages', // table name
        'receiver_contact', // new field name
        {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
      ),
      
    ]);
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
