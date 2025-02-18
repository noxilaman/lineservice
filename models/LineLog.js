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
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
        beforeCreate: (lineLog) => {
            lineLog.createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
            lineLog.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
            console.log(lineLog.createdAt);
        },
        beforeUpdate: (user) => {
            lineLog.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        }
    }
  }
);

module.exports = LineLog;
