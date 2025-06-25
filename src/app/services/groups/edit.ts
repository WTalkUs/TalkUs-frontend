import axios, { AxiosError } from "axios";
import api from "@lib/axios";
import { auth } from "@lib/firebase";

interface EditGroupData {
  description?: string;
  categories?: string[];
  banner?: File;
  icon?: File;
}

interface EditGroupSuccessResponse {
  success: true;
  data: any;
  message: string;
}

interface EditGroupErrorResponse {
  success: false;
  error: string;
  status?: number;
}

type EditGroupResponse = EditGroupSuccessResponse | EditGroupErrorResponse;

export const editGroup = async (
  groupId: string,
  groupData: EditGroupData
): Promise<EditGroupResponse> => {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;
  console.log(groupData);
  const formData = new FormData();

  if (groupData.description) {
    formData.append("description", groupData.description);
  }
  if (groupData.categories) {
    formData.append("categories", JSON.stringify(groupData.categories));
  }
  if (groupData.banner) {
    formData.append("banner", groupData.banner);
  }
  if (groupData.icon) {
    formData.append("icon", groupData.icon);
  }
  try {
    const response = await api.put(`/api/subforos/${groupId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data);
    return {
      success: true,
      data: response.data,
      message: "Grupo actualizado con éxito",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error:
          (axiosError.response?.data as string) ||
          "Error al actualizar el grupo",
        status: axiosError.response?.status,
      };
    } else {
      return {
        success: false,
        error: "Error desconocido al actualizar el grupo",
      };
    }
  }
};
