import axios, { AxiosError } from "axios";
import api from "@lib/axios";

export const getAllGroups = async (): Promise<any> => {
  try {
    const response = await api.get("/public/subforos");
    return {
      success: true,
      data: response.data,
      message: "Groups fetched successfully",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Axios error while fetching groups:", axiosError);
      return {
        success: false,
        error: axiosError.response?.data || "Error fetching groups",
        status: axiosError.response?.status,
      };
    } else {
      console.error("Unknown error while fetching groups:", error);
      return {
        success: false,
        error: "Unknown error while fetching groups",
      };
    }
  }
};
