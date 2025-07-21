exports.up = function (knex) {
  return knex.schema.createTable('payments', function (table) {
    table.uuid('id').primary();
    table
      .uuid('aluno_id')
      .notNullable()
      .references('id')
      .inTable('students')
      .onDelete('CASCADE');
    table.decimal('valor', 10, 2).notNullable();
    table.string('descricao', 100).notNullable();
    table.date('vencimento').notNullable();
    table
      .enu('status', ['PENDENTE', 'PAGO', 'ATRASADO'])
      .notNullable()
      .defaultTo('PENDENTE');
    table
      .enu('forma_pagamento', ['DINHEIRO', 'CARTAO', 'PIX', 'OUTRO'])
      .notNullable();
    table.date('data_pagamento');
    table
      .uuid('registrado_por_id')
      .notNullable()
      .references('id')
      .inTable('users');
    table.text('observacoes');
    table.timestamp('criado_em').defaultTo(knex.fn.now());
    table.timestamp('atualizado_em').defaultTo(knex.fn.now());
    table.timestamp('deletado_em');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('payments');
};
