export interface Plan {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}
