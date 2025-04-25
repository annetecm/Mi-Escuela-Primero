exports.up = async function(knex) {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    return knex.schema.createTable('Necesidad', (table) => {
        table.uuid('necesidadId').primary().primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.integer('prioridad',10).notNullable();
        //table.integer('documentoId').references('documentoId').inTable('Documento').onDelete('CASCADE');
        table.string("CCT", 20).references("CCT").inTable("Escuela").onDelete("CASCADE");
        table.string('categoria', 50).notNullable();
        table.string('nombre').notNullable();
    });
}
exports.down = function(knex) {
    return knex.schema.dropTable('Necesidad');
  };