import { api } from "@/services/api";

export const fetchXmlCompare = async () => {
  try {
    const response = await api.get("/v1/xml/read-xml");
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message || error.message || "Failed to fetch XML"
    );
  }
};
