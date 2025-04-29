exports.up = async function(knex) {
  
  return knex.schema.createTable("Escuela", (table) => {
    
    table.string("CCT", 20).primary(); // Ahora es PK (eliminamos escuelaId)
    table.text("direccion").notNullable();
    table.string("sostenimiento").notNullable();
    table.string("zonaEscolar").notNullable();
    table.uuid("usuarioId").notNullable().references("usuarioId").inTable("Usuario").onDelete("CASCADE"); // FK corregida
    table.string("sectorEscolar").notNullable();
    table.string("modalidad").notNullable(); 
    table.string("nivelEducativo").notNullable();
    table.string("tieneUSAER").notNullable(); 
    table.integer("numeroDocentes").notNullable();
    table.integer("estudiantesPorGrupo").notNullable(); 
    table.string("controlAdministrativo").notNullable();
    table.double("latitud").notNullable();
    table.double("longitud").notNullable();
  
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("Escuela");
};