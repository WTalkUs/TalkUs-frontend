"use client";
import axios, { AxiosError } from "axios";
import api from "../../lib/axios";
import { getAuth } from "firebase/auth";

interface EditProfileData {
  displayName: string;
  photo?: File;
  banner?: File;
}

interface EditProfileSuccessResponse {
  success: true;
  data: any;
  message: string;
}

interface EditProfileErrorResponse {
  success: false;
  error: string;
  status?: number;
}

type EditProfileResponse =
  | EditProfileSuccessResponse
  | EditProfileErrorResponse;

export const editProfile = async (
  data: EditProfileData
): Promise<EditProfileResponse> => {
  const auth = getAuth();
  const user = auth.currentUser;
  try {
    const token = user ? await user.getIdToken() : null;
    const formData = new FormData();
    formData.append("display_name", data.displayName);
    if (data.photo) {
      formData.append("profile_photo", data.photo);
    }
    if (data.banner) {
      formData.append("banner_image", data.banner);
    }

    const response = await api.put("/api/edit-profile", formData, {
      params: { id: user?.uid },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Respuesta del servidor:", response.data);

    return {
      success: true,
      data: response.data,
      message: "Perfil actualizado correctamente",
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
        error: "Error desconocido al actualizar el perfil",
        status: 500,
      };
    }
  }
};
