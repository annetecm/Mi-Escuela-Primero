const express = require('express');
const cors = require('cors');
const app = express();

// Configuración esencial
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Importa y usa las rutas CORRECTAMENTE
const escuelaRouter = require('./rutas/escuela');
app.use('/api/escuela', escuelaRouter); // Nota el prefijo completo aquí

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});