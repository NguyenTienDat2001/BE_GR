"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BorrowPayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BorrowPayment.init(
    {
        borrow_id: DataTypes.INTEGER,
        infor: DataTypes.TEXT,
        bank_code: DataTypes.STRING,
        amount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "BorrowPayment",
      tableName: "borrow-payments",
    }
  );
  return BorrowPayment;
};
