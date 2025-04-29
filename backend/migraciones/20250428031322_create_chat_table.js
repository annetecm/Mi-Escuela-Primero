exports.up = function(knex) {
    return knex.schema.createTable("Chat", function(table) {
      table.uuid("conexionId").primary()
        .references("conexionId").inTable("Conexion")
        .onDelete("CASCADE");
  
      table.timestamps(true, true); // created_at y updated_at (opcional)
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("Chat");
  };
  