exports.up = async function(knex) {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    return knex.schema.createTable('Representante', (table) => {
        
        table.uuid("RepId").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.string('nombreRep', 100).notNullable(); 
      table.string('correoRep', 100).notNullable().unique(); 
      table.string('telefonoRep', 20); 
      table.string('areaRep', 50); 
      table.string('RFC', 13); 
     
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('Representante');
  };