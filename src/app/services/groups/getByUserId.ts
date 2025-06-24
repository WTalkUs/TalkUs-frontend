import axios, { AxiosError } from "axios";
import api from "@lib/axios";
import { getAuth } from "firebase/auth";

export interface Group {
  forumId: string;
  title: string;
  description: string;
  categories: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  createdBy: string;
  bannerUrl?: string;
  iconUrl?: string;
  members?: string[];
  moderators?: string[];
}

export interface GetGroupsByUserIdResponse {
  success: boolean;
  data?: Group[];
  message?: string;
  error?: string | object;
  status?: number;
}

export const getGroupsByUserId = async (
  userId: string
): Promise<GetGroupsByUserIdResponse> => {
  const auth = getAuth();
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;
  try {
    const response = await api.get(`/api/subforos/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      success: true,
      data: response.data,
      message: "User groups fetched successfully",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Axios error while fetching user groups:", axiosError);
      return {
        success: false,
        error: axiosError.response?.data || "Error fetching user groups",
        status: axiosError.response?.status,
      };
    } else {
      console.error("Unknown error while fetching user groups:", error);
      return {
        success: false,
        error: "Unknown error while fetching user groups",
      };
    }
  }
};
