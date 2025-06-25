import axios, { AxiosError } from "axios";
import api from "@/app/lib/axios";
import { getAuth } from "firebase/auth";

export interface ReportPostData {
  postId: string;
}

interface ReportPostSuccessResponse {
  success: true;
  message: string;
}

interface ReportPostErrorResponse {
  success: false;
  error: string;
  status?: number;
}

export type ReportPostResponse =
  | ReportPostSuccessResponse
  | ReportPostErrorResponse;

export const reportPost = async (
  data: ReportPostData
): Promise<ReportPostResponse> => {
  const auth = getAuth();
  const user = auth.currentUser;
  try {
    const token = user ? await user.getIdToken() : null;
    const response = await api.post(
      `/api/posts/${data.postId}/report`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      success: true,
      message: response.data.message || "Reporte enviado correctamente",
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
