import api from '../../lib/axios'; 
import type { AxiosError } from 'axios';
import axios from 'axios';

interface RegisterUserData {
  username: string;
  email: string;
  password: string;
}

interface RegisterSuccessResponse {
  success: true;
  data: any; // Puedes especificar mejor este tipo según tu API
  message: string;
}

interface RegisterErrorResponse {
  success: false;
  error: string;
  status?: number;
}

type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse;

export const register = async (userData: RegisterUserData): Promise<RegisterResponse> => {
  try {
    const response = await api.post('/public/register', userData);
    return {
      success: true,
      data: response.data,
      message: 'Usuario registrado correctamente'
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
    
    // Error genérico
    return {
      success: false,
      error: (error as Error).message || 'Error al realizar la solicitud'
    };
  }
};