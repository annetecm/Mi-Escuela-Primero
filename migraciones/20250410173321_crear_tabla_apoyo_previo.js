exports.up = function(knex) {
    return knex.schema.createTable("ApoyoPrevio", (table) => {
      table.string("CCT", 20).primary().references("CCT").inTable("Escuela").onDelete("CASCADE");
      table.text("descripcion").notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("ApoyoPrevio");
  };