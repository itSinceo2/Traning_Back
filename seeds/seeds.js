require("dotenv").config();
require("../config/db.config");

const mongoose = require("mongoose");


const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';

// Importa todos los scripts de semillas
const seedUsers = require("./users.seeds");

const runSeedScripts = () => {
  // Ejecuta los scripts de semillas
  seedUsers()
    .then(() => {
      // Puedes ejecutar otros scripts de semillas aquí
      console.log("Seeding completed successfully");

      // Cierra la conexión después de ejecutar todos los scripts
      mongoose.connection.close();
    })
    .catch((error) => {
      console.error("Error seeding data", error);
      mongoose.connection.close();
    });
};

// Establece la conexión a la base de datos
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Successfully connected to the database", URI);

    // Ejecuta los scripts de semillas después de la conexión
    runSeedScripts();
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });


