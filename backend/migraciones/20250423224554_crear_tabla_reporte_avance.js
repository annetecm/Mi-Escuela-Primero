exports.up = async function(knex) {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')
    return knex.schema.createTable('ReporteAvance', function(table) {

  
      table.uuid('reporteAvanceId').primary().defaultTo(knex.raw("gen_random_uuid()")); 
      table.uuid('conexionId').notNullable().references('conexionId').inTable('Conexion').onDelete('CASCADE');
      table.string('tipo', 50).notNullable();
      table.date('fecha').notNullable();
      table.text('descripcion');
      table.text('ruta').notNullable();
     
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('ReporteAvance');
  };
