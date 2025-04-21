const { Pool } = require('pg');

const pool = new Pool({
  user: 'fakeadmin',
  host: 'localhost',
  database: 'testdb',
  password: 'fakeadmin', // pon la contraseña correcta
  port: 5432,
  ssl: false
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error al conectar:', err.message);
  }
  console.log('✅ Conexión a DB establecida');
  release();
});

module.exports = pool;
