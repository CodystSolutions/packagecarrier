'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('packages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sender_id: {
        type: Sequelize.BIGINT
      },
      receiver_id: {
        type: Sequelize.BIGINT
      },
      sender_info: {
        type: Sequelize.JSONB
      },
      receiver_info: {
        type: Sequelize.JSONB
      },
      request_id: {
        type: Sequelize.BIGINT
      },
      destination: {
        type: Sequelize.STRING
      },
      source: {
        type: Sequelize.STRING
      },
      tracking_number: {
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.STRING
      },
      weight: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      method: {
        type: Sequelize.STRING
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
      transaction_id: {
        type: Sequelize.STRING
      },
      created_on: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')

      },
      modified_on: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')

      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('packages');
  }
};