"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PermissUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PermissUser.init(
    {
      user_id: DataTypes.INTEGER,
      permiss_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PermissUser",
      tableName: "permiss-users",
    }
  );
  return PermissUser;
};
