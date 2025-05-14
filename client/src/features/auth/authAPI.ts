import { api } from "@services/api";
import {
  LoginFormInterface,
  LogoutFormInterface,
  RegisterFormInterface,
} from "@/types";

export const register = async (data: RegisterFormInterface) => {
  const response = await api.post("/v1/auth/register", data);
  return response.data;
};

export const login = async (data: LoginFormInterface) => {
  const response = await api.post("/v1/auth/login", data);
  return response.data;
};

export const logout = async (data: LogoutFormInterface) => {
  const response = await api.post("/v1/auth/logout", data);
  return response.data;
};

export const refreshAccessToken = async (refreshToken: string) => {
  const response = await api.post("/v1/auth/refresh-tokens", {
    refreshToken,
  });
  return response.data;
};
