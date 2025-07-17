exports.up = function (knex) {
  return knex.schema.table('students', function (table) {
    table.index('user_id', 'idx_students_user_id');
  });
};

exports.down = function (knex) {
  return knex.schema.table('students', function (table) {
    table.dropIndex('user_id', 'idx_students_user_id');
  });
};
