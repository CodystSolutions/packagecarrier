'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        autoIncrement: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contact: {
          type: Sequelize.BIGINT,
          allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      branch: {
        type: Sequelize.STRING,
        allowNull: true
      },
      role: {
        type: Sequelize.STRING,
        allowNull: true
      },
      
      is_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
     
      trn: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
     
      uuid: {
        type: Sequelize.UUID,
        allowNull: false
      },
    
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      details: {
        type: Sequelize.JSONB,
        allowNull: true
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
      },
     
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};