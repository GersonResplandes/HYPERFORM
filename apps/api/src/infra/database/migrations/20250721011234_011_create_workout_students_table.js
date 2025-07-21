/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('workout_students', (table) => {
    table.uuid('id').primary();
    table
      .uuid('workout_id')
      .notNullable()
      .references('id')
      .inTable('workouts')
      .onDelete('CASCADE');
    table
      .uuid('student_id')
      .notNullable()
      .references('id')
      .inTable('students')
      .onDelete('CASCADE');
    table.boolean('ativo').notNullable().defaultTo(true);
    table.timestamp('vinculado_em').defaultTo(knex.fn.now());
    table.timestamp('desvinculado_em');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('workout_students');
};
