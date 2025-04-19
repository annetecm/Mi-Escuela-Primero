
exports.up = function(knex) {
    return knex.schema.createTable("MesaDirectiva", (table) => {
      table.string("CCT", 20).primary().references("CCT").inTable("Escuela").onDelete("CASCADE");
      table.integer("personasCantidad").notNullable();
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("MesaDirectiva");
  
};
