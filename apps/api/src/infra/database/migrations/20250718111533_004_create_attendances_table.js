exports.up = function (knex) {
  return knex.schema.createTable('attendances', function (table) {
    table.uuid('id').primary();
    table
      .uuid('student_id')
      .notNullable()
      .references('id')
      .inTable('students')
      .onDelete('CASCADE');
    table.date('check_in_date').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.unique(['student_id', 'check_in_date']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('attendances');
};
