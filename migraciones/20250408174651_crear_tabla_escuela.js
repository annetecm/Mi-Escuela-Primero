/**
 * @param {import('knex')} knex
 */

exports.up = function(knex) {
    return knex.schema.createTable("Escuela", (table) => {
      table.uuid("escuelaId").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.text("direccion").notNullable();
      table.string("sostenimiento").notNullable();
      table.string("zonaEscolar").notNullable();
      table.uuid("usuarioId").notNullable().references("usuarioId").inTable("Usuario").onDelete("CASCADE");
      table.string("sectorEscolar").notNullable();
      table.string("modalidad").notNullable();
      table.string("nivelEducativo").notNullable();
      table.string("CCT", 20).notNullable();
      table.boolean("tieneUSAER").notNullable().defaultTo(false);
      table.integer("numeroDocentes").notNullable();
      table.integer("estudiantesPorGrupo").notNullable();
      table.string("controlAdministrativo").notNullable();
    });
  };
  
  
  /**
   * @param {import('knex')} knex
   */
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("Escuela");
  };
  