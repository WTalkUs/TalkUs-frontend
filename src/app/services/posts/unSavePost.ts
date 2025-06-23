import axios, { AxiosError } from "axios";
import api from "@/app/lib/axios";
import { getAuth } from "firebase/auth";

export interface UnSavePostData {
  postId: string;
}

interface UnSavePostSuccessResponse {
  success: true;
  message: string;
}

interface UnSavePostErrorResponse {
  success: false;
  error: string;
  status?: number;
}

export type SavePostResponse = UnSavePostSuccessResponse | UnSavePostErrorResponse;

export const unSavePost = async (
  data: UnSavePostData
): Promise<SavePostResponse> => {
  const auth = getAuth();
  const user = auth.currentUser;
  try {
    const token = user ? await user.getIdToken() : null;
    const response = await api.delete(
      `api/posts/${data.postId}/unsave?user_id=${user?.uid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      success: true,
      message: response.data.message || "Post guardado correctamente",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const resp = error.response;
      return {
        success: false,
        error:
          (resp?.data as { error: string })?.error ||
          resp?.statusText ||
          "Error del servidor",
        status: resp?.status,
      };
    }
    return {
      success: false,
      error: "Error desconocido",
    };
  }
};