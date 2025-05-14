export interface RegisterFormInterface {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

export interface LoginFormInterface {
  email: string;
  password: string;
}

export interface LogoutFormInterface {
  refreshToken: string;
}
