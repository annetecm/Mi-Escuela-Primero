
/** Tabla: Aliado */
exports.up = async function(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  return knex.schema.createTable("Aliado", (table) => {
    table.text("aliadoId").primary();
    table.string("tipoDeApoyo").notNullable();
    table.uuid("usuarioId").notNullable().references("usuarioId").inTable("Usuario").onDelete("CASCADE");
    table.string("tipoId").notNullable(); // CURP o RFC
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("Aliado");
};


