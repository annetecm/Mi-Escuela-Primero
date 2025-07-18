/**
 * @param {import('knex')} knex
 */

exports.up = async function(knex) {

await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    
return knex.schema.createTable("Usuario", (table) => {
      table.uuid("usuarioId").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.string("correoElectronico").notNullable();
      table.string("contraseña").notNullable();
      table.string("nombre").notNullable();
      table.string("estadoRegistro").notNullable().defaultTo("pendiente"); 
    });
  };
  
  /**
   * @param {import('knex')} knex
   */
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("Usuario");
  };
  