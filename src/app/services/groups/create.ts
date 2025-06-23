import axios, { AxiosError } from "axios";
import api from "@lib/axios";
import { auth } from "@lib/firebase";
import placeholderImage from "../../../../public/placeholder-banner.png"; // Asegúrate de tener una imagen de marcador de posición

interface CreateGroupData {
  Title: string;
  Description: string;
  Categories: string[];
  BannerURL?: File;
  IconURL?: File;
}

interface CreateGroupSuccessResponse {
  success: true;
  data: any; 
  message: string;
}

interface CreateGroupErrorResponse {
  success: false;
  error: string;
  status?: number;
}
type CreateGroupResponse = CreateGroupSuccessResponse | CreateGroupErrorResponse;

export const createGroup = async (groupData: CreateGroupData): Promise<CreateGroupResponse> => {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;
  const formData = new FormData();
  formData.append("title", groupData.Title);
  formData.append("description", groupData.Description);
  formData.append("categories", JSON.stringify(groupData.Categories));
  if (groupData.BannerURL) {
    formData.append("banner_url", groupData.BannerURL);
  }
  if (groupData.IconURL) {
    formData.append("icon_url", groupData.IconURL);
  }
  try {
    const response = await api.post("/api/subforos", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      success: true,
      data: response.data,
      message: "Grupo creado con éxito",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: axiosError.response?.data as string || "Error al crear el grupo",
        status: axiosError.response?.status,
      };
    } else {
      return {
        success: false,
        error: "Error desconocido al crear el grupo",
      };
    }
  }
};
