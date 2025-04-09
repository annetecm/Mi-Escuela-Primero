/**
 * @param {import('knex')} knex
 */

exports.up = function(knex) {
    return knex.schema.createTable("Usuario", (table) => {
      table.uuid("usuarioId").primary().defaultTo(knex.raw("uuid_generate_v4()"));
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
  