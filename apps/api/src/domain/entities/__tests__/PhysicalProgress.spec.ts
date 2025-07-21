import { PhysicalProgress } from '../PhysicalProgress';

describe('PhysicalProgress Entity', () => {
  it('deve criar uma avaliação física válida', () => {
    const progress: PhysicalProgress = {
      id: 'uuid',
      aluno_id: 'aluno-uuid',
      data_avaliacao: new Date('2024-06-01'),
      peso: 78.5,
      altura: 1.75,
      imc: 25.6,
      gordura: 15.8,
      massa_magra: 66.0,
      abdomen: 80,
      peitoral: 100,
      biceps: 35,
      coxa: 55,
      observacoes: 'Ótima evolução',
      registrado_por_id: 'instrutor-uuid',
      criado_em: new Date(),
      atualizado_em: new Date(),
    };
    expect(progress.peso).toBe(78.5);
    expect(progress.imc).toBeGreaterThan(0);
    expect(progress.aluno_id).toBe('aluno-uuid');
  });

  it('deve permitir campos opcionais ausentes', () => {
    const progress: PhysicalProgress = {
      id: 'uuid',
      aluno_id: 'aluno-uuid',
      data_avaliacao: new Date('2024-06-01'),
      peso: 80,
      altura: 1.8,
      registrado_por_id: 'instrutor-uuid',
      criado_em: new Date(),
      atualizado_em: new Date(),
    };
    expect(progress.gordura).toBeUndefined();
    expect(progress.massa_magra).toBeUndefined();
  });
});
