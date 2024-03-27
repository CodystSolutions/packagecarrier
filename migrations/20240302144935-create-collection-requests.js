'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('collection_requests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      packages: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      method: {
        type: Sequelize.STRING
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
      transaction_id: {
        type: Sequelize.INTEGER
      },
      code: {
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
    await queryInterface.dropTable('collection_requests');
  }
};