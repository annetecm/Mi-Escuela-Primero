exports.up = function(knex) {
    return knex.schema.createTable('ReporteAvance', function(table) {
      // Primary key
      table.increments('reporteAvanceId').primary();
      
      
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
