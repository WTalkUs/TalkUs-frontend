import axios, { AxiosError } from "axios";
import api from "@lib/axios";
import { auth } from "@lib/firebase";

// Mejoramos la interfaz Author para coincidir con el backend
interface Author {
  uid: string;
  username: string;
  email: string;
  profile_photo?: string; // Hacer opcional para consistencia
  banner_image?: string;  // Hacer opcional
}

// Unificamos la interfaz Comment
interface Comment {
  CommentID: string;      // Cambiado a minúscula para consistencia
  PostID: string;
  AuthorID: string;
  Author?: Author | null; // Mejor manejo de null
  Content: string;        // Unificado (sin Content mayúscula)
  CreatedAt: string;
  UpdatedAt?: string;     // Añadido para ediciones
  Likes: number;
  Dislikes: number;
}

// Tipos de respuesta mejorados
interface CommentSuccessResponse<T = Comment | Comment[] | undefined | null> {
  success: true;
  data: T;
  message: string;
}

interface CommentErrorResponse {
  success: false;
  error: string;
  status?: number;
}

type CommentResponse<T = Comment | Comment[]> = CommentSuccessResponse<T> | CommentErrorResponse;

// Normalización robusta
function normalizeComment(comment: any, currentUserId: string): Comment {
  const userReaction = comment.reactions?.[currentUserId] || null;

  return {
    CommentID: comment.commentID || comment.CommentID,
    PostID: comment.postID || comment.PostID,
    AuthorID: comment.authorID || comment.AuthorID,
    Author: comment.author || comment.Author,
    Content: comment.content || comment.Content || '',
    CreatedAt: comment.createdAt || comment.CreatedAt,
    UpdatedAt: comment.updatedAt || comment.UpdatedAt,
    userReaction,
    Likes: Object.values(comment.reactions || {}).filter(r => r === 'like').length,
    Dislikes: Object.values(comment.reactions || {}).filter(r => r === 'dislike').length,
    replies: (comment.replies || []).map((r: any) => normalizeComment(r, currentUserId))
  };
}
export const commentService = {
  async create(commentData: { postId: string; content: string }): Promise<CommentResponse<Comment>> {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        error: "Usuario no autenticado",
        status: 401
      };
    }

    try {
      const token = await user.getIdToken();
      const response = await api.post("/api/comments", {
        postId: commentData.postId,
        content: commentData.content
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      return {
        success: true,
        data: normalizeComment(response.data.comment || response.data),
        message: response.data.message || "Comentario creado con éxito"
      };
    } catch (error) {
      return handleCommentError(error, "crear");
    }
  },

  async getByPost(postId: string, currentUserId: string): Promise<CommentResponse<Comment[]>> {
  try {
    const response = await api.get(`/public/comments/post/${postId}`);
    const normalizedComments = Array.isArray(response.data) 
      ? response.data.map(comment => normalizeComment(comment, currentUserId))
      : [normalizeComment(response.data, currentUserId)];

    return {
      success: true,
      data: normalizedComments,
      message: "Comentarios obtenidos con éxito"
    };
  } catch (error) {
    return handleCommentError(error, "obtener");
  }
},

  async update({ commentId, content }: { commentId: string; content: string }) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const token = await user.getIdToken();
    const response = await api.put(`/api/comments/${commentId}`, {
      content 
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      data: response.data,
      message: "Comentario actualizado"
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error en actualización:", error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || "Error al actualizar comentario",
        status: error.response?.status
      };
    }
    return {
      success: false,
      error: "Error desconocido"
    };
  }
},

  async delete(commentId: string): Promise<CommentResponse<null>> {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        error: "Usuario no autenticado",
        status: 401
      };
    }

    try {
      const token = await user.getIdToken();
      await api.delete(`/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return {
        success: true,
        data: null,
        message: "Comentario eliminado con éxito"
      };
    } catch (error) {
      return handleCommentError(error, "eliminar");
    }
  },

  async react({ commentId, reaction }: { commentId: string; reaction: 'like' | 'dislike' }): Promise<CommentResponse<Comment>> {
  const user = auth.currentUser;
  if (!user) {
    return {
      success: false,
      error: "Usuario no autenticado",
      status: 401
    };
  }

  try {
    const token = await user.getIdToken();
    const response = await api.post(`/api/${commentId}/reaction`, {
      reaction
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    return {
      success: true,
      data: normalizeComment(response.data),
      message: "Reacción registrada"
    };
  } catch (error) {
    return handleCommentError(error, "registrar reacción");
  }
},

async createReply({ parentId, content }: { 
  parentId: string; 
  content: string 
}): Promise<CommentResponse<Comment>> {
  const user = auth.currentUser;
  if (!user) {
    return {
      success: false,
      error: "Usuario no autenticado",
      status: 401
    };
  }

  try {
    const token = await user.getIdToken();
    const response = await api.post(`/api/reply`, {
      parentId,
      content
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    return {
      success: true,
      data: normalizeComment(response.data),
      message: "Respuesta creada con éxito"
    };
  } catch (error) {
    return handleCommentError(error, "crear respuesta");
  }
},


async getReplies(postId: string): Promise<CommentResponse<Comment[]>> {
  try {
    const response = await api.get(`/api/post/${postId}/tree`);
    return {
      success: true,
      data: response.data,
      message: "Respuestas obtenidas con éxito"
    };
  } catch (error) {
    return handleCommentError(error, "obtener respuestas");
  }
}
};

function handleCommentError(error: unknown, action: string): CommentErrorResponse {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { error?: string; message?: string } | undefined;
    const errorMessage = data?.error 
      || data?.message
      || `Error al ${action} el comentario`;

    return {
      success: false,
      error: errorMessage,
      status: axiosError.response?.status
    };
  }
  
  return {
    success: false,
    error: `Error desconocido al ${action} el comentario`
  };
}