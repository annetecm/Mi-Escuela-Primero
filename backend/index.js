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
const evidenceRoutes = require('./rutas/evidence');
const aliadoRouter = require('./rutas/aliado');
const documentRouter= require('./rutas/documents');
const conexionRouter = require('./rutas/conexion');
const adminRouter = require('./rutas/admin');

const chatRoutes = require("./rutas/Chat.");




app.use('/api/auth', authRouter); 
app.use('/api/escuela', escuelaRouter); 
app.use('/api/evidence', evidenceRoutes);
app.use('/api/aliado', aliadoRouter);
app.use('/api', documentRouter);
app.use('/api/', conexionRouter); // <- ahora sí, correcto
app.use('/api/conexion', conexionRouter); // <- ahora sí, correcto
app.use('/api/admin', adminRouter);
app.use("/api/chat", chatRoutes);



const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});