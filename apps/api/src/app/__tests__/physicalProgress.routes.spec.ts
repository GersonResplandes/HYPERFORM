import request from 'supertest';
import { app } from '../../app';

describe('Physical Progress Routes', () => {
  let tokenInstrutor: string;
  let tokenAluno: string;
  let alunoId: string;
  let avaliacaoId: string;

  beforeAll(async () => {
    // Criação de usuário instrutor e aluno, obtenção de tokens e alunoId
    // Aqui você pode mockar ou usar factories reais do seu sistema
    tokenInstrutor = 'Bearer token-instrutor';
    tokenAluno = 'Bearer token-aluno';
    alunoId = 'uuid-aluno';
  });

  it('deve permitir que INSTRUTOR crie uma avaliação', async () => {
    const res = await request(app)
      .post('/progresso-fisico/avaliacoes')
      .set('Authorization', tokenInstrutor)
      .send({
        aluno_id: alunoId,
        data_avaliacao: '2024-07-01',
        peso: 80,
        altura: 1.8,
        imc: 24.7,
        gordura: 15.2,
        massa_magra: 68,
      });
    expect(res.status).toBe(201);
    avaliacaoId = res.body.id;
  });

  it('deve permitir que INSTRUTOR atualize uma avaliação', async () => {
    const res = await request(app)
      .put(`/progresso-fisico/avaliacoes/${avaliacaoId}`)
      .set('Authorization', tokenInstrutor)
      .send({ peso: 81 });
    expect(res.status).toBe(200);
    expect(res.body.peso).toBe(81);
  });

  it('deve permitir que INSTRUTOR remova uma avaliação', async () => {
    const res = await request(app)
      .delete(`/progresso-fisico/avaliacoes/${avaliacaoId}`)
      .set('Authorization', tokenInstrutor);
    expect(res.status).toBe(204);
  });

  it('deve permitir que ALUNO visualize seu progresso', async () => {
    const res = await request(app)
      .get(`/progresso-fisico/alunos/${alunoId}/progresso`)
      .set('Authorization', tokenAluno);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve permitir que ALUNO visualize dados para gráfico', async () => {
    const res = await request(app)
      .get(`/progresso-fisico/alunos/${alunoId}/progresso/grafico`)
      .set('Authorization', tokenAluno);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('labels');
    expect(res.body).toHaveProperty('series');
  });

  it('deve proibir ALUNO de criar avaliação', async () => {
    const res = await request(app)
      .post('/progresso-fisico/avaliacoes')
      .set('Authorization', tokenAluno)
      .send({ aluno_id: alunoId, peso: 80, altura: 1.8 });
    expect(res.status).toBe(403);
  });
});
