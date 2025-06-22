"use client";

import axios, { AxiosError } from "axios";
import api from "../../lib/axios";
import { getAuth } from "firebase/auth";

export interface Post {
  id: string;
  author_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  is_flagged: boolean;
  forum_id: string;
  image_url: string;
  likes: number;
  dislikes: number;
}

interface GetPostsByAuthorSuccessResponse {
  success: true;
  data: Post[];
}

interface GetPostsByAuthorErrorResponse {
  success: false;
  error: string;
  status?: number;
}

export type GetPostsByAuthorResponse =
  | GetPostsByAuthorSuccessResponse
  | GetPostsByAuthorErrorResponse;

export const getPostsByAuthorID = async (
  authorId: string
): Promise<GetPostsByAuthorResponse> => {
  const auth = getAuth();
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;
  try {
    const response = await api.get(`/api/posts/author?author_id=${authorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return {
      success: true,
      data: response.data,
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
