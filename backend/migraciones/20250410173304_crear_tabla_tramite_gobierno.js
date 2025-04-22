exports.up = function(knex) {
    return knex.schema.createTable("TramiteGobierno", (table) => {
      table.string("CCT", 20).primary().references("CCT").inTable("Escuela").onDelete("CASCADE");
      table.string("instancia").notNullable();
      table.string("estado").notNullable();
      table.string("folioOficial").notNullable();
      table.string("nivelGobierno").notNullable();
      table.text("descripcion").notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("TramiteGobierno");
  };