exports.up = function(knex) {
    return knex.schema.alterTable('Notificacion', function(table) {
      table.uuid('conexionId').references('conexionId').inTable('Conexion').onDelete('CASCADE');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('Notificacion', function(table) {
      table.dropColumn('conexionId');
    });
  };
  