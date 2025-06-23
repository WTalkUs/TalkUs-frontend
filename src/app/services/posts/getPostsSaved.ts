"use client";
import axios from "axios";
import api from "@/app/lib/axios";
import { getAuth } from "firebase/auth";

export interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  tags: string[];
  image_url: string;
  image_id: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
}

interface GetSavedPostsSuccess {
  success: true;
  posts: Post[];
}

interface GetSavedPostsError {
  success: false;
  error: string;
  status?: number;
}

export type GetSavedPostsResponse = GetSavedPostsSuccess | GetSavedPostsError;

export const getSavedPosts = async (
  userId: string
): Promise<GetSavedPostsResponse> => {
  const auth = getAuth();
  const user = auth.currentUser;
  try {
    const token = user ? await user.getIdToken() : null;
    const response = await api.get<Post[]>("api/posts/saved", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { user_id: userId },
    });
    return {
      success: true,
      posts: response.data,
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