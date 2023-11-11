require("dotenv").config();
// Importar librerías
const express = require('express');
const logger = require("morgan");
const mongoose = require("mongoose");
const createError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const cors = require("cors");

require("./config/db.config");

const app = express();

//cors
app.use(
    cors({
      origin: process.env.CORS_ORIGIN || ["http://localhost:5173", "http://127.0.0.1:5173"],
    })
  );

  //configurar el servidor
app.use(logger("dev"));
app.use(express.json());

//ruta inicial

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the API" });
  });


//rutas
const usersRouter = require("./routes/user.routes");
app.use("/users", usersRouter);

//route not found
app.use((req, res, next) => {
    next(createError(StatusCodes.NOT_FOUND, "Route not found"));
  });
  
  //error handler
  app.use((error, req, res, next) => {
    res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ error: error.message });
  });
  
//listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});




