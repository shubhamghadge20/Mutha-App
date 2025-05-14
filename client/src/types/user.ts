export interface User {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  mobile: string;
  role: string;
}

export interface CreateUserInterface {
  name: string;
  email: string;
  password: string;
  role: string;
  mobile: string;
}

export interface UpdateUserInterface {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  mobile?: string;
  isEmailVerified?: boolean;
  id?: string;
}
