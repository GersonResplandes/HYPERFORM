export enum ObjetivoTreino {
  HIPERTROFIA = 'HIPERTROFIA',
  EMAGRECIMENTO = 'EMAGRECIMENTO',
  RESISTENCIA = 'RESISTENCIA',
  CONDICIONAMENTO = 'CONDICIONAMENTO',
  OUTRO = 'OUTRO',
}

export interface Workout {
  id: string;
  nome: string;
  descricao: string;
  objetivo: ObjetivoTreino;
  frequencia_semanal: number;
  ativo: boolean;
  criado_por_id: string;
  created_at: Date;
  updated_at: Date;
}
