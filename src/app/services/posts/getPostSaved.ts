import axios, { AxiosError } from "axios";
import api from "@/app/lib/axios";
import { getAuth } from "firebase/auth";

export interface GetSavedStatusData {
  postId: string;
  userId: string;
}

interface GetSavedStatusSuccess {
  success: true;
  saved: boolean;
}

interface GetSavedStatusError {
  success: false;
  error: string;
  status?: number;
}

export type GetSavedStatusResponse = GetSavedStatusSuccess | GetSavedStatusError;

export const getSavedStatus = async (
  { postId, userId }: GetSavedStatusData
): Promise<GetSavedStatusResponse> => {
  const auth = getAuth();
  const user = auth.currentUser;
  try {
    const token = user ? await user.getIdToken() : null;
    const resp = await api.get<{ saved: boolean }>(
      `api/post/${postId}/saved`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { user_id: userId },
      }
    );
    return { success: true, saved: resp.data.saved };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.statusText || "Error del servidor",
        status: error.response?.status,
      };
    }
    return { success: false, error: "Error desconocido" };
  }
};