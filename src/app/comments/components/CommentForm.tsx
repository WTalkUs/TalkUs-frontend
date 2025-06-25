"use client";
import { Button, Textarea } from "@heroui/react";
import { useState } from "react";
import { commentService } from "@/app/services/comments/commentService";
import { useAuth } from "@/app/contexts/AuthProvider";

export const CommentForm = ({ 
  postId,
  onSuccess
}: { 
  postId: string;
  onSuccess: () => void;
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!content.trim() || !user) return;
    setSubmitting(true);
    setError(null);

    const result = await commentService.create({
      postId,
      content
    });

    if (result.success) {
      setContent("");
      onSuccess();
    } else {
      setError(result.error);
    }
    setSubmitting(false);
  };

  return (
    <div className="mb-6">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe tu comentario..."
        minRows={3}
      />
      {error && <div className="text-red-500 mt-1">{error}</div>}
      <div className="flex justify-end mt-2">
        <Button 
          onPress={handleSubmit}
          isLoading={submitting}
          isDisabled={!content.trim()}
        >
          {submitting ? "Publicando..." : "Publicar comentario"}
        </Button>
      </div>
    </div>
  );
};