import { api } from "@services/api";
import { XmlComparisonHistoryItem } from "@/types/xmlComparison";

interface PaginatedXmlHistoryResponse {
  data: XmlComparisonHistoryItem[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export const fetchXmlHistory = async (
  product?: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedXmlHistoryResponse> => {
  const params = new URLSearchParams();
  if (product) params.append("product", product);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const url = `/v1/history?${params.toString()}`;
  const response = await api.get(url);
  return response.data;
};

export const deleteXmlHistoryById = async (
  id: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/v1/history/${id}`);
  return response.data;
};
