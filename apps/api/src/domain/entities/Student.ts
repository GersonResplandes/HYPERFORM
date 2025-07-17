export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface StudentProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  birth_date: Date;
  gender: Gender;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  user_id: string;
}

export class Student {
  public readonly id: string;
  public name: string;
  public email: string;
  public phone: string;
  public birth_date: Date;
  public gender: Gender;
  public notes?: string;
  public created_at: Date;
  public updated_at: Date;
  public deleted_at?: Date | null;
  public user_id: string;

  constructor(props: StudentProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
    this.birth_date = props.birth_date;
    this.gender = props.gender;
    this.notes = props.notes;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.deleted_at = props.deleted_at;
    this.user_id = props.user_id;
  }
}
