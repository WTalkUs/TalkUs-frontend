import axios, { AxiosError } from "axios";
import api from "../../lib/axios";
import { Post } from "./getAll";


export interface GetForumPostResponse {
  success: boolean;
  data?: Post[];
  message?: string;
  error?: string | object;
  status?: number;
}

export default async function getForumPost(
  postId: string
): Promise<GetForumPostResponse> {
  try {
    const response = await api.get(`/public/posts/forum/${postId}`);
    return {
      success: true,
      data: response.data,
      message: "Post fetched successfully",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Axios error while fetching post:", axiosError);
      return {
        success: false,
        error: axiosError.response?.data || "Error fetching post",
        status: axiosError.response?.status,
      };
    } else {
      console.error("Unknown error while fetching post:", error);
      return {
        success: false,
        error: "Unknown error while fetching post",
      };
    }
  }
}
