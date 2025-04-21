const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' }); 

// Cargar variables de entorno desde el archivo .env en la raíz del proyecto
const sslConfig = process.env.NODE_ENV === 'production' ? { 
  rejectUnauthorized: false 
} : false;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig
});

// Verify database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error(' Error al conectar:', err.message);
  }
  console.log(' Conexión a DB establecida');
  release();
});

module.exports = pool;