'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.BIGINT
      },
      paymentmethod: {
        type: Sequelize.STRING
      },
      reference: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      cclast4: {
        type: Sequelize.STRING
      },
      cctype: {
        type: Sequelize.STRING
      },
      tendered: {
        type: Sequelize.DOUBLE
      },
      change: {
        type: Sequelize.DOUBLE
      },
      total: {
        type: Sequelize.DOUBLE
      },
      status: {
        type: Sequelize.STRING
      },
      order_number: {
        type: Sequelize.STRING
      },
      package_ids: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      details: {
        type: Sequelize.JSONB
      },
      notes: {
        type: Sequelize.TEXT
      },
      is_deleted: {
        type: Sequelize.BOOLEAN
      },
      created_on: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      },
      modified_on: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};