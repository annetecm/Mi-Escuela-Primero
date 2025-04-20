/** Tabla: PersonaMoral */
exports.up = function(knex) {
    return knex.schema.createTable("PersonaMoral", (table) => {
      table.string("RFC").primary();
      table.string("numeroEscritura").notNullable();
      table.string("area").notNullable();
      table.string("correoElectronico").notNullable();
      table.string("telefono").notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("PersonaMoral");
  };
  