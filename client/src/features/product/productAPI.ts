import { api } from "@services/api";

import { CreateProductInterface, UpdateProductInterface } from "@/types";

export const createProduct = async (data: CreateProductInterface) => {
  const response = await api.post("/v1/product", data);
  return response.data;
};

export const getProduct = async (id: string) => {
  const response = await api.get(`/v1/product/${id}`);
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get("/v1/product");
  return response.data;
};

export const updateProduct = async (
  id: string,
  data: UpdateProductInterface
) => {
  const response = await api.patch(`/v1/users/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/v1/product/${id}`);
  return response.data;
};
