import axios, { AxiosError } from "axios";
import api from "@lib/axios";
import { getAuth } from "firebase/auth";

interface CreateGroupData {
  Title: string;
  Description: string;
  Category: string;
}

export const createGroup = async (groupData: CreateGroupData): Promise<any> => {
  const auth = getAuth();
  const user = auth.currentUser;

  const token = user ? await user.getIdToken() : null;

  try {
    const response = await api.post("/api/subforos", groupData,{
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
        error: axiosError.response?.data || "Error al crear el grupo",
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
