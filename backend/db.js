const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' }); // Ajusta la ruta según tu estructura

// Configuración condicional para SSL
const sslConfig = process.env.NODE_ENV === 'production' ? { 
  rejectUnauthorized: false 
} : false;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig
});

// Verificación de conexión mejorada
pool.connect((err, client, release) => {
  if (err) {
    return console.error(' Error al conectar:', err.message);
  }
  console.log(' Conexión a DB establecida');
  release();
});

module.exports = pool;