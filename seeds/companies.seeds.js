require("dotenv").config();
require("../config/db.config");

console.log("Seeding companies...")

const mongoose = require("mongoose");
const Company = require("../models/Company.model");
const companies = require("./json/companies.json");

const seedCompanies = () => {

    mongoose.connection
    .dropCollection("companies")
    .then(() => {
        console.log("DB cleared");

        return Company.create(companies);
    })
    .then((companyDB) => {
        companyDB.forEach((company) => {
        console.log(`${company.name} has been created`);
        });

        console.log(`${companyDB.length} companies have been created`);
    })
    .catch((err) => console.error(err))
    .finally(() => {
        mongoose.disconnect();
    });

}

module.exports = seedCompanies;

if(require.main === module) {
    console.log("ejecución directa de semilla ")
    mongoose.connection.once("open", () => {
    mongoose.connection
        .dropCollection("companies")
        .then(() => {
        console.log("DB cleared");

        return Company.create(companies);
        })
        .then((companyDB) => {
            companyDB.forEach((company) => {
            console.log(`${company.name} has been created`);
            });

            console.log(`${companyDB.length} companies have been created`);
        })
        .catch((err) => console.error(err))
        .finally(() => {
        mongoose.disconnect();
        });
    });
}

