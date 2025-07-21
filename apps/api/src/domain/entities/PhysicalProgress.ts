export interface PhysicalProgress {
  id: string;
  aluno_id: string;
  data: Date;
  peso: number;
  altura: number;
  percentual_gordura?: number;
  circunferencia_peito?: number;
  circunferencia_cintura?: number;
  circunferencia_quadril?: number;
  circunferencia_braco?: number;
  circunferencia_coxa?: number;
  observacoes?: string;
  registrado_por_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
