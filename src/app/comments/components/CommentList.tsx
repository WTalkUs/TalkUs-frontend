"use client";
import {
  Avatar,
  Button,
  Textarea,
  Spinner,
  Alert,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { commentService } from "@/app/services/comments/commentService";
import { CommentForm } from "@/app/comments/components/CommentForm";
import { useAuth } from "@/app/contexts/AuthProvider";
import {
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Edit,
  Trash,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Comment } from "@/app/services/comments/commentService";

export const CommentList = ({
  postId,
  showForm = true,
}: {
  postId: string;
  showForm?: boolean;
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { uid } = user || {};

  const fetchComments = async () => {
    try {
      setLoading(true);
      const result = await commentService.getByPost(postId, uid || "");
      if (result.success) {
        // Organizar comentarios en estructura jerárquica
        const commentsWithReplies = buildCommentTree(result.data);
        setComments(commentsWithReplies);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Error al cargar comentarios");
    } finally {
      setLoading(false);
    }
  };

  console.log("comments", comments);
  const buildCommentTree = (comments: Comment[]): Comment[] => {
    const commentMap: Record<string, Comment> = {};
    const rootComments: Comment[] = [];

    // Primero creamos un mapa de todos los comentarios
    comments.forEach((comment) => {
      commentMap[comment.CommentID] = {
        ...comment,
        replies: [],
        showReplies: false,
        Likes: comment.Likes || 0,
        Dislikes: comment.Dislikes || 0,
      };
    });

    // Luego asignamos los comentarios a sus padres
    comments.forEach((comment) => {
      if (comment.ParentID && commentMap[comment.ParentID]) {
        commentMap[comment.ParentID].replies?.push(
          commentMap[comment.CommentID]
        );
      } else if (!comment.ParentID) {
        rootComments.push(commentMap[comment.CommentID]);
      }
    });

    return rootComments;
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleDelete = async (commentId: string) => {
    try {
      setActionError(null);
      const result = await commentService.delete(commentId);
      if (result.success) {
        // Función recursiva para eliminar el comentario y sus respuestas
        const removeComment = (commentsList: Comment[]): Comment[] => {
          return commentsList
            .filter((c) => c.CommentID !== commentId)
            .map((c) => ({
              ...c,
              replies: c.replies ? removeComment(c.replies) : [],
            }));
        };

        setComments((prev) => removeComment(prev));
        setActionSuccess("Comentario eliminado");
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setActionError(result.error);
      }
    } catch (err) {
      setActionError("Error al eliminar comentario");
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      setActionError(null);
      const result = await commentService.update({
        commentId: editingId,
        content: editContent,
      });
      if (result.success) {
        // Función recursiva para actualizar el comentario
        const updateComment = (commentsList: Comment[]): Comment[] => {
          return commentsList.map((c) => {
            if (c.CommentID === editingId) {
              return { ...c, Content: editContent };
            }
            if (c.replies) {
              return { ...c, replies: updateComment(c.replies) };
            }
            return c;
          });
        };

        setComments((prev) => updateComment(prev));
        setEditingId(null);
        setActionSuccess("Comentario actualizado");
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setActionError(result.error);
      }
    } catch (err) {
      setActionError("Error al actualizar comentario");
    }
  };

  const handleReply = async (parentId: string) => {
    try {
      setActionError(null);
      const result = await commentService.createReply({
        parentId,
        content: replyContent,
      });

      if (result.success) {
        // Función recursiva para agregar la respuesta
        const addReply = (commentsList: Comment[]): Comment[] => {
          return commentsList.map((c) => {
            if (c.CommentID === parentId) {
              const newReply = {
                ...result.data,
                replies: [],
                showReplies: true,
                Likes: 0,
                Dislikes: 0,
              };
              return {
                ...c,
                replies: [...(c.replies || []), newReply],
                showReplies: true,
              };
            }
            if (c.replies) {
              return { ...c, replies: addReply(c.replies) };
            }
            return c;
          });
        };
        setComments((prev) => addReply(prev));
        setReplyingTo(null);
        setReplyContent("");
        setActionSuccess("Respuesta enviada");
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setActionError(result.error);
      }
    } catch (err) {
      setActionError("Error al enviar respuesta");
    }
  };

  const handleReaction = async (
    commentId: string,
    reaction: "like" | "dislike"
  ) => {
    try {
      setActionError(null);
      const result = await commentService.react({
        commentId,
        reaction,
      });

      if (result.success) {
        const updateReaction = (commentsList: Comment[]): Comment[] => {
          return commentsList.map((c) => {
            if (c.CommentID === commentId) {
              let likes = c.Likes || 0;
              let dislikes = c.Dislikes || 0;
              const currentReaction = c.userReaction;

              if (currentReaction === reaction) {
                // Si hace clic en la misma reacción, la quitamos
                if (reaction === "like") likes--;
                else dislikes--;
                return {
                  ...c,
                  Likes: likes,
                  Dislikes: dislikes,
                  userReaction: null,
                };
              }

              // Si tenía otra reacción, la cambiamos
              if (currentReaction === "like") likes--;
              if (currentReaction === "dislike") dislikes--;
              if (reaction === "like") likes++;
              if (reaction === "dislike") dislikes++;

              return {
                ...c,
                Likes: likes,
                Dislikes: dislikes,
                userReaction: reaction,
              };
            }

            // Recursivo en replies
            if (c.replies) {
              return { ...c, replies: updateReaction(c.replies) };
            }

            return c;
          });
        };

        setComments((prev) => updateReaction(prev));
      } else {
        setActionError(result.error);
      }
    } catch (err) {
      setActionError("Error al registrar reacción");
    }
  };

  const toggleReplies = (commentId: string) => {
    const toggle = (commentsList: Comment[]): Comment[] => {
      return commentsList.map((c) => {
        if (c.CommentID === commentId) {
          return { ...c, showReplies: !c.showReplies };
        }
        if (c.replies) {
          return { ...c, replies: toggle(c.replies) };
        }
        return c;
      });
    };
    setComments((prev) => toggle(prev));
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  // Componente recursivo para renderizar comentarios y respuestas
  const renderComment = (comment: Comment, depth = 0) => {
    const isReplying = replyingTo === comment.CommentID;
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
      <div
        key={`comment-${comment.CommentID}`}
        className={`border-b border-gray-100 pb-6 last:border-0 ${
          depth > 0 ? "ml-10 pl-6 border-l-2 border-gray-200" : ""
        }`}
      >
        <div className="flex gap-5">
          <Avatar
            src={comment.Author?.profile_photo}
            name={comment.Author?.username}
            size="lg"
          />

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-lg text-gray-500">
                  {comment.Author?.username || "Usuario"}
                </h4>
                <span className="text-sm text-gray-300">
                  {formatDate(comment.CreatedAt)}
                </span>
              </div>

              {user?.uid === comment.Author?.uid && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="ghost"
                      size="md"
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    >
                      <MoreVertical size={20} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu className="bg-gray-800 text-white shadow-lg rounded-lg">
                    <DropdownItem
                      className="hover:bg-gray-700 font-semibold"
                      key={`edit-${comment.CommentID}`}
                      startContent={<Edit size={20} />}
                      onPress={() => {
                        setEditingId(comment.CommentID);
                        setEditContent(comment.Content);
                      }}
                    >
                      Editar
                    </DropdownItem>
                    <DropdownItem
                      key={`delete-${comment.CommentID}`}
                      startContent={<Trash size={20} />}
                      color="danger"
                      onPress={() => handleDelete(comment.CommentID)}
                    >
                      Eliminar
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>

            {editingId === comment.CommentID ? (
              <div className="mt-4 space-y-4">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  minRows={3}
                />
                <div className="flex gap-3">
                  <Button onPress={handleUpdate}>Guardar cambios</Button>
                  <Button variant="flat" onPress={() => setEditingId(null)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-3 text-lg text-white">{comment.Content}</p>

                <div className="flex gap-6 mt-4">
                  <Button
                    className={`
    ${
      comment.userReaction === "like"
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "bg-white/10 text-white hover:bg-white/20"
    } 
    border border-white/20
  `}
                    variant={
                      comment.userReaction === "like" ? "solid" : "ghost"
                    }
                    size="md"
                    startContent={<ThumbsUp size={20} />}
                    onPress={() => handleReaction(comment.CommentID, "like")}
                  >
                    {comment.Likes || 0}
                  </Button>
                  <Button
                    className={`
    ${
      comment.userReaction === "dislike"
        ? "bg-red-600 text-white hover:bg-red-700"
        : "bg-white/10 text-white hover:bg-white/20"
    } 
    border border-white/20
  `}
                    variant={
                      comment.userReaction === "dislike" ? "solid" : "ghost"
                    }
                    size="md"
                    startContent={<ThumbsDown size={20} />}
                    onPress={() => handleReaction(comment.CommentID, "dislike")}
                  >
                    {comment.Dislikes || 0}
                  </Button>
                  <Button
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    variant="ghost"
                    size="md"
                    startContent={<MessageSquare size={20} />}
                    onPress={() => {
                      setReplyingTo(comment.CommentID);
                      setReplyContent("");
                    }}
                  >
                    Responder
                  </Button>
                </div>

                {hasReplies && (
                  <Button
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    variant="ghost"
                    size="md"
                    startContent={
                      comment.showReplies ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )
                    }
                    onPress={() => toggleReplies(comment.CommentID)}
                  >
                    {comment.showReplies
                      ? "Ocultar respuestas"
                      : `Mostrar respuestas (${comment.replies?.length})`}
                  </Button>
                )}
              </>
            )}

            {isReplying && (
              <div className="mt-5 pl-6 border-l-2 border-gray-200">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  minRows={3}
                />
                <div className="flex gap-3 mt-3">
                  <Button onPress={() => handleReply(comment.CommentID)}>
                    Enviar respuesta
                  </Button>
                  <Button variant="flat" onPress={() => setReplyingTo(null)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {hasReplies && comment.showReplies && (
              <div className="mt-5 space-y-6">
                {comment.replies?.map((reply) =>
                  renderComment(reply, depth + 1)
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <Spinner className="mx-auto my-8" />;

  return (
    <div className="space-y-8">
      {showForm && user && (
        <CommentForm postId={postId} onSuccess={fetchComments} />
      )}

      {actionSuccess && (
        <Alert
          isVisible={!!actionSuccess}
          color="success"
          variant="faded"
          title={actionSuccess}
          onClose={() => setActionSuccess(null)}
        />
      )}

      {comments.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-base">
          No hay comentarios aún
        </div>
      ) : (
        <div className="space-y-8">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
};
