"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Coupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Coupon.init(
    {
      code: DataTypes.STRING,
      des: DataTypes.TEXT,
      type: DataTypes.STRING,
      value: DataTypes.INTEGER,
      point: DataTypes.INTEGER,
      condition: DataTypes.INTEGER,
      status: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Coupon",
      tableName: "coupons",
    }
  );
  return Coupon;
};
