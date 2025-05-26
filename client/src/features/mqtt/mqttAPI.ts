import { api } from "@services/api";

export const lockFurnace = async (): Promise<string> => {
  const response = await api.get("/v1/mqtt/lock");
  return response.data;
};

export const unlockFurnace = async (): Promise<string> => {
  const response = await api.get("/v1/mqtt/unlock");
  return response.data;
};
