/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('physical_progress', (table) => {
    table.uuid('id').primary();
    table
      .uuid('aluno_id')
      .notNullable()
      .references('id')
      .inTable('students')
      .onDelete('CASCADE');
    table.date('data').notNullable();
    table.decimal('peso').notNullable();
    table.decimal('altura').notNullable();
    table.decimal('percentual_gordura');
    table.decimal('circunferencia_peito');
    table.decimal('circunferencia_cintura');
    table.decimal('circunferencia_quadril');
    table.decimal('circunferencia_braco');
    table.decimal('circunferencia_coxa');
    table.text('observacoes');
    table
      .uuid('registrado_por_id')
      .notNullable()
      .references('id')
      .inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('physical_progress');
};
