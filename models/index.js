const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
const basename = path.basename(__filename);
const fs = require("fs");
require("dotenv").config(path.resolve(__dirname, "../.env"));

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
    operatorsAliases: 0,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model1 = require(`./${path.basename(file)}`);
    const model = model1(sequelize, Sequelize);
    db[model.name] = model;
  });
db.sequelize = sequelize;
db.Sequelize = Sequelize;
sequelize.sync().then(() => {
  console.log(`Database & tables created!`);
});

db.userModel = require("./userModel")(sequelize, DataTypes);

module.exports = db;
