import axios, { AxiosError } from "axios";
import api from "@lib/axios";
import { getAuth } from "firebase/auth";

export const getAllGroups = async (): Promise<any> => {
  const auth = getAuth();
  console.log("Authentication object:", auth);
  const user = auth.currentUser;
  console.log("Fetching all groups for user:", user);
  const token = user ? await user.getIdToken() : null;
  console.log("User token:", token);
  try {
    const response = await api.get("/public/subforos", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Response from API:", response.data);
    return {
      success: true,
      data: response.data,
      message: "Groups fetched successfully",
    };
  }
  catch (error) {
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
