"use client";
import axios, { AxiosError } from "axios";
import api from "../../lib/axios";
import { getAuth } from "firebase/auth";

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordSuccessResponse {
  success: true;
  data: any;
  message: string;
}

interface ChangePasswordErrorResponse {
  success: false;
  error: string;
  status?: number;
}

type ChangePasswordResponse =
  | ChangePasswordSuccessResponse
  | ChangePasswordErrorResponse;

export const changePassword = async (
  data: ChangePasswordData
): Promise<ChangePasswordResponse> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return {
      success: false,
      error: "Usuario no autenticado",
      status: 401,
    };
  }

  try {
    const token = await user.getIdToken();

    const response = await api.put(
      "/api/change-password",
      {
        current_password: data.currentPassword,
        new_password: data.newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Respuesta del servidor:", response.data);

    return {
      success: true,
      data: response.data,
      message: "Contraseña cambiada correctamente",
    };
  } catch (error) {
    console.error("Error completo:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Error de Axios:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });

      return {
        success: false,
        error:
          (axiosError.response?.data as any)?.message || axiosError.message,
        status: axiosError.response?.status,
      };
    } else {
      return {
        success: false,
        error: "Error desconocido al cambiar la contraseña",
        status: 500,
      };
    }
  }
};
