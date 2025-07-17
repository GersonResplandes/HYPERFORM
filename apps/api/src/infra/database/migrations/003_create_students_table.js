exports.up = function (knex) {
  return knex.schema.createTable('students', function (table) {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('phone').notNullable();
    table.date('birth_date').notNullable();
    table.enu('gender', ['MALE', 'FEMALE', 'OTHER']).notNullable();
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
    table.uuid('user_id').notNullable();
    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.unique(['email', 'user_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('students');
};
