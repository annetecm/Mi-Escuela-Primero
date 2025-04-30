exports.up = function(knex) {
    return knex.schema.createTable("RepresentanteLegal", (table) => {
      table.increments("id").primary();
      table.string("nombre").notNullable();
      table.string("correo").notNullable();
      table.string("telefono").notNullable();
      table.string("area").notNullable();
      table.string("RFC").notNullable().references("RFC").inTable("PersonaMoral");
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("RepresentanteLegal");
  };
  