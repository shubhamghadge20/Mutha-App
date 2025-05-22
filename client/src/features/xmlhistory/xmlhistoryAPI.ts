import { api } from "@services/api";
import { XmlComparisonHistoryItem } from "@/types/xmlComparison";

export const fetchXmlHistory = async (
  product?: string
): Promise<XmlComparisonHistoryItem[]> => {
  const url = product ? `/v1/history?product=${product}` : `/v1/history`;
  const response = await api.get(url);
  return response.data;
};
