import { api } from "@services/api";

import { CreateUserInterface, UpdateUserInterface } from "@/types";

export const createUser = async (data: CreateUserInterface) => {
  const response = await api.post("/v1/users", data);
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await api.get(`/v1/users/${id}`);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/v1/users");
  return response.data;
};

export const updateUser = async (id: string, data: UpdateUserInterface) => {
  const response = await api.patch(`/v1/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/v1/users/${id}`);
  return response.data;
};
