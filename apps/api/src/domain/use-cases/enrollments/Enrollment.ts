export interface Enrollment {
  id: string;
  student_id: string;
  plan_id: string;
  start_date: Date;
  end_date: Date;
  price: number;
  created_at: Date;
  deleted_at?: Date | null;
}
