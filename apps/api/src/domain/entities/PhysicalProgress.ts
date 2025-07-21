export interface PhysicalProgress {
  id: string;
  aluno_id: string;
  data_avaliacao: Date;
  peso: number;
  altura: number;
  imc?: number;
  gordura?: number;
  massa_magra?: number;
  abdomen?: number;
  peitoral?: number;
  biceps?: number;
  coxa?: number;
  observacoes?: string;
  registrado_por_id: string;
  criado_em: Date;
  atualizado_em: Date;
  deletado_em?: Date;
}
