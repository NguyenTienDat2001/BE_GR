"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Borrow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Borrow.init(
    {
      user_id: DataTypes.INTEGER,
      book_id: DataTypes.INTEGER,
      end_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Borrow",
      tableName: "borrows",
    }
  );
  return Borrow;
};
