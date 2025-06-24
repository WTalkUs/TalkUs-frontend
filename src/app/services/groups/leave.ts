import axios, { AxiosError } from "axios";
import api from "@lib/axios";
import { auth } from "@lib/firebase";

interface JoinGroupResponse {
  success: boolean;
  message?: string;
  error?: string;
  status?: number;
}

export default async function leaveGroup(
  groupId: string
): Promise<JoinGroupResponse> {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;
  try {
    const response = await api.post(`/api/subforos/${groupId}/leave`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: true,
      message: "Successfully left the group",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Axios error while leaving group:", axiosError);
      return {
        success: false,
        error: axiosError.response?.data as string || "Error leaving group",
        status: axiosError.response?.status,
      };
    } else {
      console.error("Unknown error while leaving group:", error);
      return {
        success: false,
        error: "Unknown error while leaving group",
      };
    }
  }
}