const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LineLog = sequelize.define(
  "LineLogs",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    group_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    msg: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secret: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "line_logs",
    timestamps: false,
  }
);

module.exports = LineLog;
