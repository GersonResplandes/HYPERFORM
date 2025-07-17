/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('enrollments', (table) => {
    table.uuid('id').primary();
    table.uuid('student_id').notNullable().references('id').inTable('students');
    table.uuid('plan_id').notNullable().references('id').inTable('plans');
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable(); // para soft delete
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('enrollments');
};
