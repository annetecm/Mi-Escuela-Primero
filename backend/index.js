const express = require("express");
const app = express();
const cors = require("cors");

// Middleware
app.use(express.json());
app.use(cors());

// Todas las rutas están ahora en escuela.js
app.use("/api", require("./rutas/escuela")); // puedes usar "/api" o el prefijo que quieras
app.use("/api/auth", require("./rutas/auth"));

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
