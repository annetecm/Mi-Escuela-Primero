/** Tabla: PersonaFisica */
exports.up = function(knex) {
    return knex.schema.createTable("PersonaFisica", (table) => {
      table.string("CURP").primary();
      table.string("institucionLaboral").notNullable();
      table.string("razon").notNullable();
      table.string("correoElectronico").notNullable();
      table.string("telefono").notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("PersonaFisica");
  };