exports.up = function(knex){
    return knex.schema.createTable('Documento',(table)=>{
        table.increments('documentoId').primary();
        table.string('tipo').notNullable();
        table.string('ruta').notNullable();
        table.string('fechaCarga').notNullable();
        table.uuid('usuarioId').references('usuarioId').inTable('Usuario').onDelete('CASCADE');
        table.string('nombre', 100).notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Documento');
  };