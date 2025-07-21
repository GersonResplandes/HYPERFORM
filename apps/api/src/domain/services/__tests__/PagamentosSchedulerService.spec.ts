import { PagamentosSchedulerService } from '../PagamentosSchedulerService';
import { PlanoPagamento } from '../../entities/PlanoPagamento';
import {
  Payment,
  StatusPagamento,
  FormaPagamento,
} from '../../entities/Payment';
import {
  NotificacaoPagamento,
  TipoNotificacao,
} from '../../entities/NotificacaoPagamento';
import { v4 as uuidv4 } from 'uuid';
import { addDays, subDays } from 'date-fns';

describe('PagamentosSchedulerService', () => {
  let planos: PlanoPagamento[];
  let pagamentos: Payment[];
  let notificacoes: NotificacaoPagamento[];

  const planosRepo = {
    findAll: jest.fn(async () => planos),
  } as any;
  const paymentsRepo = {
    findAll: jest.fn(async () => pagamentos),
    create: jest.fn(async (p) => {
      pagamentos.push(p);
      return p;
    }),
    updateStatus: jest.fn(async (id, status) => {
      const pg = pagamentos.find((p) => p.id === id);
      if (pg) pg.status = status;
    }),
  } as any;
  const notificacoesRepo = {
    create: jest.fn(async (n) => {
      notificacoes.push(n);
      return n;
    }),
    findAll: jest.fn(async () => notificacoes),
  } as any;

  beforeEach(() => {
    planos = [
      {
        id: uuidv4(),
        aluno_id: uuidv4(),
        descricao: 'Plano Mensal',
        valor: 100,
        inicio: new Date(),
        dia_vencimento: addDays(new Date(), 3).getDate(),
        ativo: true,
        criado_em: new Date(),
        atualizado_em: new Date(),
      },
    ];
    pagamentos = [];
    notificacoes = [];
  });

  it('gera pagamento recorrente para plano ativo', async () => {
    const scheduler = new PagamentosSchedulerService(
      planosRepo,
      paymentsRepo,
      notificacoesRepo
    );
    await scheduler.processarDia(new Date());
    expect(pagamentos.length).toBe(1);
    expect(pagamentos[0].status).toBe(StatusPagamento.PENDENTE);
  });

  it('atualiza status para ATRASADO se vencido', async () => {
    pagamentos.push({
      id: uuidv4(),
      aluno_id: planos[0].aluno_id,
      valor: 100,
      descricao: 'Plano Mensal',
      vencimento: subDays(new Date(), 2),
      status: StatusPagamento.PENDENTE,
      forma_pagamento: FormaPagamento.OUTRO,
      registrado_por_id: '',
      criado_em: new Date(),
      atualizado_em: new Date(),
    });
    const scheduler = new PagamentosSchedulerService(
      planosRepo,
      paymentsRepo,
      notificacoesRepo
    );
    await scheduler.processarDia(new Date());
    expect(pagamentos[0].status).toBe(StatusPagamento.ATRASADO);
  });

  it('registra notificações mockadas 3 dias antes e no vencimento', async () => {
    const vencimento = addDays(new Date(), 3);
    pagamentos.push({
      id: uuidv4(),
      aluno_id: planos[0].aluno_id,
      valor: 100,
      descricao: 'Plano Mensal',
      vencimento,
      status: StatusPagamento.PENDENTE,
      forma_pagamento: FormaPagamento.OUTRO,
      registrado_por_id: '',
      criado_em: new Date(),
      atualizado_em: new Date(),
    });
    const scheduler = new PagamentosSchedulerService(
      planosRepo,
      paymentsRepo,
      notificacoesRepo
    );
    // 3 dias antes
    await scheduler.processarDia(subDays(vencimento, 3));
    // No dia do vencimento
    await scheduler.processarDia(vencimento);
    expect(
      notificacoes.some(
        (n) => n.tipo_notificacao === TipoNotificacao.LEMBRETE_3_DIAS
      )
    ).toBe(true);
    expect(
      notificacoes.some(
        (n) => n.tipo_notificacao === TipoNotificacao.LEMBRETE_VENCIMENTO
      )
    ).toBe(true);
  });
});
