const express = require('express');
const cors = require('cors');
const app = express();

// Configuración esencial
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Imports and uses the routes
const authRouter = require('./rutas/auth'); 
const escuelaRouter = require('./rutas/escuela');
const uploadRouter = require('./rutas/evidence');
const aliadoRouter = require('./rutas/aliado');
const documentRouter= require('./rutas/documents');
const conexionRouter = require('./rutas/conexion');
const adminRouter = require('./rutas/admin');


app.use('/api/auth', authRouter); 
app.use('/api/escuela', escuelaRouter); 
app.use('/api', uploadRouter);
app.use('/api/aliado', aliadoRouter);
app.use('/api', documentRouter);
app.use('/api', conexionRouter);
app.use('/api/admin', adminRouter);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});