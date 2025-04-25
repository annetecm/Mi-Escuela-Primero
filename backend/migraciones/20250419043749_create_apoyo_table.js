/** Tabla: Apoyo */
exports.up = function(knex) {
    return knex.schema.createTable("Apoyo", (table) => {
      table.uuid("apoyoId").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.text("aliadoId").notNullable().references("aliadoId").inTable("Aliado").onDelete("CASCADE");
      table.string("tipo").notNullable();       // Ej: "Alimentación", "Infraestructura"
      table.string("caracteristicas").notNullable(); // Ej: "Desayunos", "Pintura"
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("Apoyo");
  };
  