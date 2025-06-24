import axios, { AxiosError } from 'axios';
import api from '@lib/axios';


interface CreatePostData {
  author_id: string;
  title: string;
  content: string;
  tag: string[];
  image?: File;
  forum_id?: string; 
}

interface CreatePostSuccessResponse {
  success: true;
  data: any; 
  message: string;
}

interface CreatePostErrorResponse {
  success: false;
  error: string;
  status?: number;
}

type CreatePostResponse = CreatePostSuccessResponse | CreatePostErrorResponse;


export const createPost = async (postData: CreatePostData): Promise<CreatePostResponse> => {
  try {
    const formData = new FormData();
    formData.append('author_id', postData.author_id);
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    if (postData.forum_id) {
      formData.append('forum_id', postData.forum_id);
    }
    
    if (postData.tag) {
      formData.append('tags', JSON.stringify(postData.tag));
    }
    
    if (postData.image) {
      formData.append('image', postData.image, postData.image.name);
    }
    
    const response = await api.post(
      `/public/posts`, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    
    return {
      success: true,
      data: response.data,
      message: 'Post creado con éxito'
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {

        return {
          success: false,
          error: axiosError.response.data as string || 'Error en el servidor',
          status: axiosError.response.status
        };
      } else if (axiosError.request) {

        return {
          success: false,
          error: 'No se recibió respuesta del servidor'
        };
      }
    }

    return {
      success: false,
      error: (error as Error).message || 'Error al crear el post'
    };
  }
};