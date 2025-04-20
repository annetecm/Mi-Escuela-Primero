/** Tabla: EscrituraPublica */
exports.up = function(knex) {
    return knex.schema.createTable("EscrituraPublica", (table) => {
      table.string("numeroEscritura").primary();
      table.date("fechaEscritura").notNullable();
      table.string("otorgadaNotario").notNullable();
      table.string("ciudad").notNullable();
      table.string("RFC").notNullable().references("RFC").inTable("PersonaMoral");
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("EscrituraPublica");
  };
  