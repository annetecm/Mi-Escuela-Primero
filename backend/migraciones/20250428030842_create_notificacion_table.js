exports.up = function(knex) {
    return knex.schema.createTable("Notificacion", function(table) {
      table.uuid("notificacionId").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.text("emisor").notNullable();
      table.text("mensaje").notNullable();
      table.date("fecha").notNullable();
      table.uuid('conexionId').references('conexionId').inTable('Conexion').onDelete('CASCADE');

    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("Notificacion");
  };
  