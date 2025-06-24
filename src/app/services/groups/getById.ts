import axios, { AxiosError } from "axios";
import api from "@lib/axios";

export const getGroupById = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/public/subforos/${id}`);
    return {
      success: true,
      data: response.data,
      message: "Group fetched successfully",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Axios error while fetching group:", axiosError);
      return {
        success: false,
        error: axiosError.response?.data || "Error fetching group",
        status: axiosError.response?.status,
      };
    } else {
      console.error("Unknown error while fetching group:", error);
      return {
        success: false,
        error: "Unknown error while fetching group",
      };
    }
  }
};