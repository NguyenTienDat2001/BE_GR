'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("imexport-items", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      imexport_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'imexports',
          },
          key: 'id',
        },
        allowNull: false,
      },
      book_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'books',
          },
          key: 'id',
        },
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("imexport-items");
  }
};
