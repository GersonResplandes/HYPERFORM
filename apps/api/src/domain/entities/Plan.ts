export interface Plan {
  id: string;
  name: string;
  duration: number; // em dias
  price: number;
  created_at: Date;
  deleted_at?: Date | null;
}
