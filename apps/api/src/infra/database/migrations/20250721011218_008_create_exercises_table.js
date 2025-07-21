/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('exercises', (table) => {
    table.uuid('id').primary();
    table.string('nome').notNullable();
    table.string('descricao').notNullable();
    table
      .enu('grupo_muscular', [
        'PEITO',
        'COSTAS',
        'PERNA',
        'BÍCEPS',
        'TRÍCEPS',
        'OMBRO',
        'GLÚTEO',
        'PANTURRILHA',
        'ABDOMEN',
        'OUTRO',
      ])
      .notNullable();
    table.string('video_url');
    table.text('observacoes');
    table.boolean('ativo').notNullable().defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('exercises');
};
