export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  birth_date: Date;
  gender: Gender;
  notes?: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
