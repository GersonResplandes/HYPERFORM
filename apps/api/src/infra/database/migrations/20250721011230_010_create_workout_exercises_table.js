/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('workout_exercises', (table) => {
    table.uuid('id').primary();
    table
      .uuid('workout_id')
      .notNullable()
      .references('id')
      .inTable('workouts')
      .onDelete('CASCADE');
    table
      .uuid('exercise_id')
      .notNullable()
      .references('id')
      .inTable('exercises')
      .onDelete('CASCADE');
    table.integer('ordem').notNullable();
    table.integer('series').notNullable();
    table.string('repeticoes').notNullable();
    table.string('carga');
    table.text('observacoes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('workout_exercises');
};
