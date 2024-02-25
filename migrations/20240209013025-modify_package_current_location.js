'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // return Promise.all([
    //   queryInterface.addColumn(
    //     'packages', // table name
    //     'current_location', // new field name
    //     {
    //       type: Sequelize.STRING,
    //       allowNull: true,
    //     },
    //   ),
    //   queryInterface.addColumn(
    //     'packages', // table name
    //     'category', // new field name
    //     {
    //       type: Sequelize.STRING,
    //       allowNull: true,
    //     },
    //   ),
    //   queryInterface.addColumn(
    //     'packages', // table name
    //     'actual_weight', // new field name
    //     {
    //       type: Sequelize.DOUBLE,
    //       allowNull: true,
    //     },
    //   ),
    //   queryInterface.addColumn(
    //     'packages', // table name
    //     'sender_id', // new field name
    //     {
    //       type: Sequelize.BIGINT,
    //       allowNull: true,
    //     },
    //   ),
    //   queryInterface.addColumn(
    //     'packages', // table name
    //     'receiver_id', // new field name
    //     {
    //       type: Sequelize.BIGINT,
    //       allowNull: true,
    //     },
    //   ),
      
    // ]);
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
