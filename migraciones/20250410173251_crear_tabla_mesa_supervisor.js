exports.up = function(knex) {
    return knex.schema.createTable("Supervisor", (table) => {
      table.string("CCT", 20).primary().references("CCT").inTable("Escuela").onDelete("CASCADE");
      table.date("fechaJubilacion");
      table.string("posibleCambioZona").notNullable();
      table.string("medioContacto").notNullable();
      table.integer("antiguedadZona").notNullable();
      table.string("nombre").notNullable();
      table.string("correoElectronico").notNullable();
      table.string("telefono").notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("Supervisor");
  };