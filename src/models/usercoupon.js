"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserCoupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserCoupon.init(
    {
      user_id: DataTypes.INTEGER,
      coupon_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserCoupon",
      tableName: "user-coupons",
    }
  );
  return UserCoupon;
};
