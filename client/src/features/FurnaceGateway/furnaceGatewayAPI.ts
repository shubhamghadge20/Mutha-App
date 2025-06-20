import { api } from "@services/api";
import {
  CreateFurnaceGatewayInterface,
  UpdateFurnaceGatewayInterface,
} from "@/types";

export const createFurnaceGateway = async (
  data: CreateFurnaceGatewayInterface
) => {
  const response = await api.post("/v1/furnace-gateway", data);
  return response.data;
};

export const getFurnaceGateway = async (id: string) => {
  const response = await api.get(`/v1/furnace-gateway/${id}`);
  return response.data;
};

export const getFurnaceGateways = async () => {
  const response = await api.get("/v1/furnace-gateway");
  return response.data;
};

export const updateFurnaceGateway = async (
  id: string,
  data: UpdateFurnaceGatewayInterface
) => {
  const { id: _id, ...dataWithoutId } = data;
  const response = await api.patch(`/v1/furnace-gateway/${id}`, dataWithoutId);
  return response.data;
};

export const deleteFurnaceGateway = async (id: string) => {
  const response = await api.delete(`/v1/furnace-gateway/${id}`);
  return response.data;
};
