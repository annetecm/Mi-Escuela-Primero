exports.up = function(knex) {
    return knex.schema.createTable('Necesidad', (table) => {
        table.increments('necesidadId').primary();
        table.integer('prioridad',10).notNullable();
        table.integer('documentoId').references('documentoId').inTable('Documento').onDelete('CASCADE');
        table.string("CCT", 20).references("CCT").inTable("Escuela").onDelete("CASCADE");
        table.string('categoria', 50).notNullable();
        table.string('nombre').notNullable();
    });
}
exports.down = function(knex) {
    return knex.schema.dropTable('necesidad');
  };