"use client";
import {
  Button,
  Modal,
  ModalContent,
  useDisclosure,
  ModalHeader,
  Form,
  Input,
  Textarea,
  Select,
  SelectItem,
  Alert,
} from "@heroui/react";
import { FormEvent, useEffect, useState } from "react";
import { editPost } from "../../services/posts/edit";
import { useAuth } from "@/app/contexts/AuthProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  post: { id: string; title: string; content: string; imageUrl: string };
  onSaved?: () => void;
}

export default function EditPostModal({ isOpen, onClose, post }: Props) {
  const { user } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Estados para el manejo de errores y mensajes
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post, isOpen]);

  const handleEditPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      setError(true);
      setResponseMessage("Usuario no autenticado");
      setIsVisible(true);
      return;
    }

    if (!title || !content) {
      setError(true);
      setResponseMessage("Todos los campos son obligatorios");
      setIsVisible(true);
      return;
    }
    setIsSubmitting(true);

    try {
      const result = await editPost({
        id: post.id,
        title,
        content,
        image: imageFile || undefined,
      });

      if (result.success) {
        setSuccess(true);
        setError(false);
        setResponseMessage(result.message);

        // Limpiar el formulario
        setTitle("");
        setContent("");
        setTag("");
        setImageFile(null);

        setTimeout(() => {
          onClose();
          setIsVisible(false);
        }, 1500);
      } else {
        setError(true);
        setSuccess(false);
        setResponseMessage(`Error: ${result.error}`);
        setIsVisible(true);
      }
    } catch (error: unknown) {
      setError(true);
      setSuccess(false);
      if (error instanceof Error) {
        setResponseMessage(`Error inesperado: ${error.message}`);
      } else {
        setResponseMessage("Ocurrió un error desconocido");
      }
      setIsVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        size="xl"
        className="shadow-md shadow-fuchsia-500"
        isOpen={isOpen}
        onOpenChange={onClose}
      >
        <ModalContent className="p-8 pt-0 space-y-6">
          <ModalHeader className="h-8 text-2xl font-semibold pt-0 mx-auto">
            Edit Post
          </ModalHeader>
          {(error || success) && isVisible && (
            <Alert
              isVisible={true}
              variant="faded"
              color={error ? "danger" : "success"}
              title={responseMessage}
            />
          )}

          <Form onSubmit={handleEditPost} className="space-y-4">
            <Input
              isRequired
              name="title"
              variant="underlined"
              type="text"
              label="Title"
              className="!w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Content */}
            <Textarea
              isRequired
              name="content"
              label="Content"
              placeholder="Enter your content"
              className="!w-full"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <Input
              name="image"
              type="file"
              description="Upload an image for your post."
              className="!w-full"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setImageFile(file);
              }}
            />

            <Button
              type="submit"
              color="secondary"
              className="self-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Editing" : "Submit"}
            </Button>
          </Form>
        </ModalContent>
      </Modal>
    </>
  );
}
