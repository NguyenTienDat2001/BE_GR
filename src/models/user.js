"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      name: DataTypes.STRING,
      sex: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      DOB: DataTypes.DATE,
      address: DataTypes.STRING,
      avatar: DataTypes.STRING,
      point: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
