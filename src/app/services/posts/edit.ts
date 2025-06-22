"use client";
import axios, { AxiosError } from "axios";
import api from "@lib/axios";
import { getAuth } from "firebase/auth";

interface EditPostData {
  id: string;
  title: string;
  content: string;
  tag: string[];
  image?: File;
}

interface EditPostSuccessResponse {
  success: true;
  data: any;
  message: string;
}

interface EditPostErrorResponse {
  success: false;
  error: string;
  status?: number;
}

type EditPostResponse = EditPostSuccessResponse | EditPostErrorResponse;

export const editPost = async (
  data: EditPostData
): Promise<EditPostResponse> => {
  const auth = getAuth();
  const user = auth.currentUser;
  try {
    const token = user ? await user.getIdToken() : null;
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);

    if (data.tag) {
      formData.append('tags', JSON.stringify(data.tag));
    }
    if (data.image) {
      formData.append("image", data.image, data.image.name);
    }

    const response = await api.put(
    "/api/posts",
    formData,
    {
      params: { id: data.id },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

    return {
      success: true,
      data: response.data,
      message: "Post editado con éxito",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: axiosError.message,
        status: axiosError.response?.status,
      };
    } else {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }
};
