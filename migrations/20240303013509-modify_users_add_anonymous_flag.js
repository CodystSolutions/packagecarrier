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
      'users', // table name
      'is_anonymous', // new field name
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'users', // table name
      'address', // new field name
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
