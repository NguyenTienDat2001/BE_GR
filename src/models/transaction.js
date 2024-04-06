"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transaction.init(
    {
      order_id: DataTypes.INTEGER,
      type: DataTypes.STRING,
      infor: DataTypes.TEXT,
      bank_code: DataTypes.STRING,
      amount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "transactions",
    }
  );
  return Transaction;
};
