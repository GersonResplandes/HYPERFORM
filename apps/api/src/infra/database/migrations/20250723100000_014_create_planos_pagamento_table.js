exports.up = function(knex) {
  return knex.schema.createTable('planos_pagamento', function(table) {
    table.uuid('id').primary();
    table.uuid('aluno_id').notNullable().references('id').inTable('students').onDelete('CASCADE');
    table.string('descricao').notNullable();
    table.decimal('valor', 10, 2).notNullable();
    table.date('inicio').notNullable();
    table.integer('dia_vencimento').notNullable();
    table.boolean('ativo').notNullable().defaultTo(true);
    table.timestamp('criado_em').defaultTo(knex.fn.now());
    table.timestamp('atualizado_em').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('planos_pagamento');
}; 