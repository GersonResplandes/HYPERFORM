export enum GrupoMuscular {
  PEITO = 'PEITO',
  COSTAS = 'COSTAS',
  PERNA = 'PERNA',
  BICEPS = 'BÍCEPS',
  TRICEPS = 'TRÍCEPS',
  OMBRO = 'OMBRO',
  GLUTEO = 'GLÚTEO',
  PANTURRILHA = 'PANTURRILHA',
  ABDOMEN = 'ABDOMEN',
  OUTRO = 'OUTRO',
}

export interface Exercise {
  id: string;
  nome: string;
  descricao: string;
  grupo_muscular: GrupoMuscular;
  video_url?: string;
  observacoes?: string;
  ativo: boolean;
  created_at: Date;
  updated_at: Date;
}
