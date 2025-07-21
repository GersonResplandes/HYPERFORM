exports.up = async function (knex) {
  await knex.schema.alterTable('physical_progress', async function (table) {
    // Renomear colunas se existirem
    const hasData = await knex.schema.hasColumn('physical_progress', 'data');
    if (hasData) table.renameColumn('data', 'data_avaliacao');
    const hasDeletedAt = await knex.schema.hasColumn(
      'physical_progress',
      'deleted_at'
    );
    if (hasDeletedAt) table.renameColumn('deleted_at', 'deletado_em');
  });
  // Adicionar colunas se não existirem
  const cols = [
    'imc',
    'gordura',
    'massa_magra',
    'abdomen',
    'peitoral',
    'biceps',
    'coxa',
  ];
  for (const col of cols) {
    const exists = await knex.schema.hasColumn('physical_progress', col);
    if (!exists) {
      await knex.schema.alterTable('physical_progress', function (table) {
        table.decimal(col);
      });
    }
  }
  // Criar novas colunas criado_em e atualizado_em se não existirem
  const hasCriadoEm = await knex.schema.hasColumn(
    'physical_progress',
    'criado_em'
  );
  if (!hasCriadoEm) {
    await knex.schema.alterTable('physical_progress', function (table) {
      table.timestamp('criado_em').defaultTo(knex.fn.now());
    });
  }
  const hasAtualizadoEm = await knex.schema.hasColumn(
    'physical_progress',
    'atualizado_em'
  );
  if (!hasAtualizadoEm) {
    await knex.schema.alterTable('physical_progress', function (table) {
      table.timestamp('atualizado_em').defaultTo(knex.fn.now());
    });
  }
  // Copiar dados das antigas para as novas
  const hasCreatedAt = await knex.schema.hasColumn(
    'physical_progress',
    'created_at'
  );
  const hasUpdatedAt = await knex.schema.hasColumn(
    'physical_progress',
    'updated_at'
  );
  if (hasCreatedAt && hasAtualizadoEm) {
    await knex.raw('UPDATE physical_progress SET criado_em = created_at');
  }
  if (hasUpdatedAt && hasAtualizadoEm) {
    await knex.raw('UPDATE physical_progress SET atualizado_em = updated_at');
  }
  // Remover as antigas se existirem
  if (hasCreatedAt) {
    await knex.schema.alterTable('physical_progress', function (table) {
      table.dropColumn('created_at');
    });
  }
  if (hasUpdatedAt) {
    await knex.schema.alterTable('physical_progress', function (table) {
      table.dropColumn('updated_at');
    });
  }
};

exports.down = async function (knex) {
  // Recriar as antigas
  const hasCreatedAt = await knex.schema.hasColumn(
    'physical_progress',
    'created_at'
  );
  if (!hasCreatedAt) {
    await knex.schema.alterTable('physical_progress', function (table) {
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
  const hasUpdatedAt = await knex.schema.hasColumn(
    'physical_progress',
    'updated_at'
  );
  if (!hasUpdatedAt) {
    await knex.schema.alterTable('physical_progress', function (table) {
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }
  // Copiar dados de volta
  const hasCriadoEm = await knex.schema.hasColumn(
    'physical_progress',
    'criado_em'
  );
  if (hasCriadoEm && hasCreatedAt) {
    await knex.raw('UPDATE physical_progress SET created_at = criado_em');
  }
  const hasAtualizadoEm = await knex.schema.hasColumn(
    'physical_progress',
    'atualizado_em'
  );
  if (hasAtualizadoEm && hasUpdatedAt) {
    await knex.raw('UPDATE physical_progress SET updated_at = atualizado_em');
  }
  // Remover as novas
  if (hasCriadoEm) {
    await knex.schema.alterTable('physical_progress', function (table) {
      table.dropColumn('criado_em');
    });
  }
  if (hasAtualizadoEm) {
    await knex.schema.alterTable('physical_progress', function (table) {
      table.dropColumn('atualizado_em');
    });
  }
  // Renomear colunas de volta
  const hasDataAvaliacao = await knex.schema.hasColumn(
    'physical_progress',
    'data_avaliacao'
  );
  if (hasDataAvaliacao) {
    await knex.schema.alterTable('physical_progress', function (table) {
      table.renameColumn('data_avaliacao', 'data');
    });
  }
  const hasDeletadoEm = await knex.schema.hasColumn(
    'physical_progress',
    'deletado_em'
  );
  if (hasDeletadoEm) {
    await knex.schema.alterTable('physical_progress', function (table) {
      table.renameColumn('deletado_em', 'deleted_at');
    });
  }
  // Remover colunas extras
  const cols = [
    'imc',
    'gordura',
    'massa_magra',
    'abdomen',
    'peitoral',
    'biceps',
    'coxa',
  ];
  for (const col of cols) {
    const exists = await knex.schema.hasColumn('physical_progress', col);
    if (exists) {
      await knex.schema.alterTable('physical_progress', function (table) {
        table.dropColumn(col);
      });
    }
  }
};
