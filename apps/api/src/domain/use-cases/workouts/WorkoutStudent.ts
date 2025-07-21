export interface WorkoutStudent {
  id: string;
  workout_id: string;
  student_id: string;
  ativo: boolean;
  vinculado_em: Date;
  desvinculado_em?: Date;
  created_at: Date;
  updated_at: Date;
}
