import api from '../../lib/axios';
import axios from 'axios';
import type { AxiosError } from 'axios';

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

interface GetPostsSuccessResponse {
  success: true;
  data: Post[];
}

interface GetPostsErrorResponse {
  success: false;
  error: string;
  status?: number;
}

export type GetPostsResponse = GetPostsSuccessResponse | GetPostsErrorResponse;

export const getAllPosts = async (): Promise<GetPostsResponse> => {
  try {
    const response = await api.get('/public/posts');
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
          error: (axiosError.response.data as string) || 'Error del servidor',
          status: axiosError.response.status,
        };
      } else if (axiosError.request) {
        return {
          success: false,
          error: 'No se recibió respuesta del servidor',
        };
      }
    }
    return {
      success: false,
      error: (error as Error).message || 'Error desconocido',
    };
  }
};