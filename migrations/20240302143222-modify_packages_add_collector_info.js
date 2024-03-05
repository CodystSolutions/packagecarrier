'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'packages', // table name
      'collector_first_name', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    )
    queryInterface.addColumn(
      'packages', // table name
      'collector_last_name', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    )
    queryInterface.addColumn(
      'packages', // table name
      'collector_email', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    )
    queryInterface.addColumn(
      'packages', // table name
      'collector_contact', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    )
    queryInterface.addColumn(
      'packages', // table name
      'collector_id', // new field name
      {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
    )
    queryInterface.addColumn(
      'packages', // table name
      'collected_on', // new field name
      {
        
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('now')
        
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
