"use client";

import axios, { AxiosError } from "axios";
import api from "../../lib/axios";
import { getAuth } from "firebase/auth";

export interface ReactPostData {
  postId: string;
  type: "like" | "dislike" | "none";
  userId: string;
}

interface ReactPostSuccessResponse {
  success: true;
  message: string;
}

interface ReactPostErrorResponse {
  success: false;
  error: string;
  status?: number;
}

export type ReactPostResponse = ReactPostSuccessResponse | ReactPostErrorResponse;

export const reactToPost = async (
data: ReactPostData): Promise<ReactPostResponse> => {
    const auth = getAuth();
    const user = auth.currentUser;
  try {
    const token = user ? await user.getIdToken() : null;
    const response = await api.post(
      `/api/posts/${data.postId}/react`,
      { type: data.type ,
        userId: data.userId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return {
          success: false,
          error: axiosError.response.data as string || "Error del servidor",
          status: axiosError.response.status,
        };
      } else if (axiosError.request) {
        return {
          success: false,
          error: "No se recibió respuesta del servidor",
        };
      } else {
        return {
          success: false,
          error: axiosError.message,
        };
      }
    } else {
      return {
        success: false,
        error: "Error desconocido",
      };
    }
  }
};