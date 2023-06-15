const { v4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define("users", {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  user.beforeValidate((user, options) => {
    if (!user.id) {
      user.id = v4();
    }
  });

  return user;
};
