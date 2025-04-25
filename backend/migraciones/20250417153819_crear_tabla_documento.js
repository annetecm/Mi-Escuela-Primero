exports.up = async function(knex){
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"'); 
    return knex.schema.createTable('Documento',(table)=>{
        table.uuid('documentoId').primary().defaultTo(knex.raw('gen_random_uuid()')); 
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