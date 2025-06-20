import { api } from "@services/api";

export const lockFurnace = async (gatewayMac: string): Promise<string> => {
  const response = await api.get(`/v1/mqtt/lock?gatewayMac=${gatewayMac}`);
  return response.data;
};

export const unlockFurnace = async (gatewayMac: string): Promise<string> => {
  const response = await api.get(`/v1/mqtt/unlock?gatewayMac=${gatewayMac}`);
  return response.data;
};

export const status = async (): Promise<string> => {
  const response = await api.get("/v1/mqtt/status");
  return response.data;
};

export const enable = async (): Promise<string> => {
  const response = await api.get("/v1/mqtt/enable");
  return response.data;
};

export const disable = async (): Promise<string> => {
  const response = await api.get("/v1/mqtt/disable");
  return response.data;
};
