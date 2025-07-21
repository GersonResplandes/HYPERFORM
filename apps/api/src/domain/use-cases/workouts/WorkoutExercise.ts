export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  ordem: number;
  series: number;
  repeticoes: string;
  carga?: string;
  observacoes?: string;
  created_at: Date;
  updated_at: Date;
}
