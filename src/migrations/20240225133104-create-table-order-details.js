'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order-details", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'orders',
          },
          key: 'id'
        },
        allowNull: false,
      },
      book_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'books',
          },
          key: 'id'
        },
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("order-details");
  }
};
