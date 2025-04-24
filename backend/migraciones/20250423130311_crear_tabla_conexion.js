exports.up = async function(knex) {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    
    return knex.schema.createTable('Conexion', (table) => {
      table.uuid('conexionId').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('CCT', 20).references('CCT').inTable('Escuela').onDelete('RESTRICT').onUpdate('CASCADE');
      table.uuid('aliadoId').references('aliadoId').inTable('Aliado').onDelete('RESTRICT').onUpdate('CASCADE');
      table.uuid('necesidadId').references('necesidadId').inTable('Necesidad').onDelete('RESTRICT').onUpdate('CASCADE');
      table.uuid('apoyoId').notNullable().references('apoyoId').inTable('Apoyo').onDelete('RESTRICT').onUpdate('CASCADE');
      table.date('fechaInicio').notNullable().defaultTo(knex.fn.now());;
      table.date('fechaFin');
      table.string('estado', 20).notNullable().defaultTo('activo');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('Conexion');
  };