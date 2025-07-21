exports.up = function (knex) {
  return knex.schema.createTable('notificacoes_pagamento', function (table) {
    table.uuid('id').primary();
    table
      .uuid('pagamento_id')
      .notNullable()
      .references('id')
      .inTable('payments')
      .onDelete('CASCADE');
    table
      .enu('tipo_notificacao', ['LEMBRETE_3_DIAS', 'LEMBRETE_VENCIMENTO'])
      .notNullable();
    table.timestamp('data_envio').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('notificacoes_pagamento');
};
