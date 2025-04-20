/** Tabla: ConstanciaFisica */
exports.up = function(knex) {
    return knex.schema.createTable("ConstanciaFisica", (table) => {
      table.string("RFC").primary().references("RFC").inTable("PersonaMoral");
      table.string("razonSocial").notNullable();
      table.string("regimen").notNullable();
      table.string("domicilio").notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("ConstanciaFisica");
  };