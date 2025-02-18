const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_SERVER,
    dialect: "mssql",
    dialectOptions: {
      options: { encrypt: false, timezone: "UTC" }, // Adjust based on your MSSQL setup
    },
    timezone: "+07:00",
    logging: false, // Disable query logging
  }
);

module.exports = sequelize;
