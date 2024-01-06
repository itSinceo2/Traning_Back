require("dotenv").config();
require("../config/db.config");

console.log("Seeding users...")

const mongoose = require("mongoose");
const Users = require("../Models/User.model");
const users = require("./json/users.json");

const seedUsers = () => {


  mongoose.connection
    .dropCollection("users")
    .then(() => {
      console.log("DB cleared");

      return Users.create(users);
    })
    .then((userDB) => {
        userDB.forEach((user) => {
        console.log(`${user.username} has been created`);
      });

      console.log(`${userDB.length} users have been created`);
    })
    .catch((err) => console.error(err))
    .finally(() => {
      mongoose.disconnect();
    });

};

module.exports = seedUsers;

if(require.main === module) {
  console.log("ejecución directa de semilla ")
  mongoose.connection.once("open", () => {
  mongoose.connection
    .dropCollection("users")
    .then(() => {
      console.log("DB cleared");

      return Users.create(users);
    })
    .then((userDB) => {
        userDB.forEach((user) => {
        console.log(`${user.username} has been created`);
      });

      console.log(`${userDB.length} users have been created`);
    })
    .catch((err) => console.error(err))
    .finally(() => {
      mongoose.disconnect();
    });
});
}