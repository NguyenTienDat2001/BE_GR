"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("books", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true
      },
      buy_price: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      sell_price: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      author: {
        type: Sequelize.STRING,
        allowNull: true
      },
      age: {
        type: Sequelize.ENUM('1', '2', '3', '4'),
        // 1: 0-6tuoi 2: 6-15tuoi 3: 15-18 tuoi 4: >18 tuoi 
        allowNull: true
      },
      published_at: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      publisher: {
        type: Sequelize.STRING,
        allowNull: true
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      totalsale: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      img: {
        type: Sequelize.STRING,
        allowNull: true
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("books");
  }
};
