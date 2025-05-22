import { api } from "@services/api";
import { XmlComparisonResponse } from "@/types/xmlComparison";

export const fetchXmlComparison = async (
  product: string
): Promise<XmlComparisonResponse> => {
  const response = await api.get(`/v1/xml/compare?product=${product}`);
  return response.data;
};
