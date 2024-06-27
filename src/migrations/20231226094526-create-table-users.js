"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.ENUM('0', '1', '2'),
        allowNull: false,
        defaultValue: '2',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sex: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      DOB: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      avatar: {
        type: Sequelize.STRING,
      },
      point: {
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
