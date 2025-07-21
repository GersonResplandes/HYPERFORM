/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('workouts', (table) => {
    table.uuid('id').primary();
    table.string('nome').notNullable();
    table.string('descricao').notNullable();
    table
      .enu('objetivo', [
        'HIPERTROFIA',
        'EMAGRECIMENTO',
        'RESISTENCIA',
        'CONDICIONAMENTO',
        'OUTRO',
      ])
      .notNullable();
    table.integer('frequencia_semanal').notNullable();
    table.boolean('ativo').notNullable().defaultTo(true);
    table.uuid('criado_por_id').notNullable().references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('workouts');
};
