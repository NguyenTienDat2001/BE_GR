'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("coupons", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      des: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('0', '1', '2'),
      },
      value: {
        type: Sequelize.INTEGER,
      },
      point: {
        type: Sequelize.INTEGER,
      },
      condition: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM('0', '1', '2'),//0: khởi tạo, 1: đã đổi, 2: đã sử dụng
      },
      // start_date: {
      //   type: Sequelize.DATEONLY,
      //   allowNull: false,
      // },
      // end_date: {
      //   type: Sequelize.DATEONLY,
      //   allowNull: false,
      // },
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("coupons");
  }
};
