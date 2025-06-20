"use client";

import axios, { AxiosError } from "axios";
import api from "@/app/lib/axios";
import { auth } from "@/app/lib/firebase";

export interface User {
  id: string;
  username: string;
  profile_photo: string;
  created_at: string;
  updated_at: string;
}

interface GetUserSuccessResponse {
  success: true;
  data: User;
}

interface GetUserErrorResponse {
  success: false;
  error: string;
  status?: number;
}

export type GetUserResponse = GetUserSuccessResponse | GetUserErrorResponse;

export const getUserById = async (): Promise<GetUserResponse> => {
  const user = auth.currentUser;
  if (!user) {
    return {
      success: false,
      error: "User not authenticated",
    };
  }

  try {
    const url = `/public/users?id=${user.uid}`;
    const response = await api.get(url);
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
