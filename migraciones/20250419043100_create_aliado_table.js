
/** Tabla: Aliado */
exports.up = function(knex) {
  return knex.schema.createTable("Aliado", (table) => {
    table.uuid("aliadoId").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("tipoDeApoyo").notNullable();
    table.uuid("usuarioId").notNullable().references("usuarioId").inTable("Usuario").onDelete("CASCADE");
    table.string("tipoId").notNullable(); // CURP o RFC
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("Aliado");
};


