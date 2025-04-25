exports.up = function(knex) {
  return knex.schema.createTable("ApoyoPrevio", (table) => {
    table.string("CCT", 20).notNullable().references("CCT").inTable("Escuela").onDelete("CASCADE");
    table.string("tipo").notNullable();
    table.string("nombre").notNullable();
    table.text("descripcion").notNullable();

    // Clave primaria compuesta
    table.primary(["CCT", "tipo"]);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("ApoyoPrevio");
};