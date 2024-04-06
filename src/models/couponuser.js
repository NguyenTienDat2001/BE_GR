"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CouponUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CouponUser.init(
    {
      user_id: DataTypes.INTEGER,
      coupon_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CouponUser",
      tableName: "coupon-users",
    }
  );
  return CouponUser;
};
