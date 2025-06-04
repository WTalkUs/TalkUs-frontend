"use client";
import axios, { AxiosError } from "axios";
import api from "../../lib/axios";
import { getAuth } from "firebase/auth";

interface DeletePostSuccessResponse {
  success: true;
  message: string;
}

interface DeletePostErrorResponse {
  success: false;
  error: string;
  status?: number;
}

export type DeletePostResponse =
  | DeletePostSuccessResponse
  | DeletePostErrorResponse;

export const deletePost = async (
  id: string
): Promise<DeletePostResponse> => {

  const auth = getAuth();
  const user = auth.currentUser; 
  try {
    const token = user ? await user.getIdToken() : null ;
    const response = await api.delete(`/api/posts`, {
      params: { id },  
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      success: true,
      message: "Post eliminado con éxito",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return {
          success: false,
          error: (axiosError.response.data as string) || "Error del servidor",
          status: axiosError.response.status,
        };
      } else if (axiosError.request) {
        return {
          success: false,
          error: "No se recibió respuesta del servidor",
        };
      }
    }
    return {
      success: false,
      error: (error as Error).message || "Error desconocido",
    };
  }
};
