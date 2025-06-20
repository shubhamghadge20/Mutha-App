export interface FurnaceGateway {
  id: string;
  furnaceId: string;
  gatewayMac: string;
}

export interface CreateFurnaceGatewayInterface {
  furnaceId: string;
  gatewayMac: string;
}

export interface UpdateFurnaceGatewayInterface {
  id: string;
  furnaceId: string;
  gatewayMac: string;
}
