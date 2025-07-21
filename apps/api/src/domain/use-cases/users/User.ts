export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at?: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface UserWithoutPassword {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  updated_at?: Date;
}
