/**
 * @param {import('knex')} knex
 */

exports.up = async function(knex) {

    await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  
    return knex.schema.createTable("Administrador", (table) => {
      table.uuid("administradorId").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.uuid("usuarioId").notNullable().references("usuarioId").inTable("Usuario").onDelete("CASCADE"); // FK corregida
    });
  };
  
    /**
   * @param {import('knex')} knex
   */
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("Administrador");
  };