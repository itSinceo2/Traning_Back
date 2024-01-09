require("dotenv").config();
require("../config/db.config");

console.log("Seeding courses...")

const mongoose = require("mongoose");
const Courses = require("../models/Course.model");
const courses = require("./json/courses.json");

const seedCourses = () => {

    mongoose.connection
    .dropCollection("courses")
    .then(() => {
        console.log("DB cleared");

        return Courses.create(courses);
    })
    .then((courseDB) => {
        courseDB.forEach((course) => {
            console.log(`${course.name} has been created`);
        });

        console.log(`${courseDB.length} courses have been created`);
    })
    .catch((err) => console.error(err))
    .finally(() => {
        mongoose.disconnect();
    });

}

module.exports = seedCourses;

if(require.main === module) {
    console.log("ejecución directa de semilla ")
    mongoose.connection.once("open", () => {
        mongoose.connection
        .dropCollection("courses")
        .then(() => {
            console.log("DB cleared");

            return Courses.create(courses);
        })
        .then((courseDB) => {
            courseDB.forEach((course) => {
                console.log(`${course.name} has been created`);
            });

            console.log(`${courseDB.length} courses have been created`);
        })
        .catch((err) => console.error(err))
        .finally(() => {
            mongoose.disconnect();
        });
    });
}
