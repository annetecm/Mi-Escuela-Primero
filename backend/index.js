const express = require('express');
const cors = require('cors');
const app = express();

// Configuración esencial
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());


// Imports and uses the routes
const authRouter = require('./rutas/auth'); 
const escuelaRouter = require('./rutas/escuela');
const uploadRoute = require('./rutas/upload');
const aliadoRouter = require('./rutas/aliado');


app.use('/api/auth', authRouter); 
app.use('/api/escuela', escuelaRouter); 
app.use('/api', uploadRoute);
app.use('/api/aliado', aliadoRouter);




const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

