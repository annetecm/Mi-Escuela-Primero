/** Tabla: Institucion */
exports.up = function(knex) {
    return knex.schema.createTable("Institucion", (table) => {
      table.increments("institucionId").primary();
      table.string("giro").notNullable();
      table.string("propositoOrganizacion").notNullable();
      table.string("domicilio").notNullable();
      table.string("telefono").notNullable();
      table.string("paginaWeb");
      table.string("RFC").notNullable().references("RFC").inTable("PersonaMoral");
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("Institucion");
  };