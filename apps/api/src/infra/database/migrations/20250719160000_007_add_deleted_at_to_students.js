/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const hasColumn = await knex.schema.hasColumn('students', 'deleted_at');
  if (!hasColumn) {
    return knex.schema.alterTable('students', (table) => {
      table.timestamp('deleted_at').nullable();
    });
  }
  return Promise.resolve();
};

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('students', (table) => {
    table.dropColumn('deleted_at');
  });
};
