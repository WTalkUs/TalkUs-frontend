"use client";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  Form,
  Input,
  Textarea,
  Alert,
  Select,
  SelectItem,
  Avatar,
} from "@heroui/react";
import { FormEvent, useEffect, useState } from "react";
import { editGroup } from "@services/groups/edit";
import { useAuth } from "@/app/contexts/AuthProvider";
import { MarkdownEditor } from "@/app/common/components/MarkdownEditor";
import { profile } from "console";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  group: {
    id: string;
    title: string;
    content: string;
    categories: string[];
    bannerUrl: string;
    iconUrl: string;
  };
  onSaved?: () => void;
}

export default function EditGroupModal({ isOpen, onClose, group }: Props) {
  const { user } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Estados para el manejo de errores y mensajes
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(group.title);
      setContent(group.content);
      setCategories(group.categories);
      setBannerPreview(group.bannerUrl || "");
      setProfilePreview(group.iconUrl || "");
    }
  }, [group, isOpen]);

  const handleTagsChange = (keys: any) => {
    const selectedTags = Array.from(keys) as string[];
    setCategories(selectedTags);
  };

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
      const result = await editGroup(group.id, {
        description: content,
        categories: categories,
        banner: bannerFile || undefined,
        icon: profileFile || undefined,
      });

      if (result.success) {
        setSuccess(true);
        setError(false);
        setResponseMessage(result.message);

        // Limpiar el formulario
        setTitle("");
        setContent("");
        setBannerFile(null);
        setProfileFile(null);
        setCategories([]);
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
        className="shadow-md shadow-fuchsia-500 max-h-[90vh] overflow-y-auto"
        isOpen={isOpen}
        onOpenChange={onClose}
      >
        <ModalContent className="p-8 pt-0 space-y-6">
          <ModalHeader className="h-8 text-2xl font-semibold pt-0 mx-auto">
            Edit Group
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
            {/* Content */}
            <MarkdownEditor value={content} onChange={setContent} />

            <Select
              name="tags"
              label="Tag"
              placeholder="Select a tag"
              className="!w-full"
              selectedKeys={new Set(categories)}
              selectionMode="multiple"
              onSelectionChange={handleTagsChange}
            >
              <SelectItem key="Tecnología">Tecnología</SelectItem>
              <SelectItem key="Salud">Salud</SelectItem>
              <SelectItem key="Educación">Educación</SelectItem>
              <SelectItem key="Entretenimiento">Entretenimiento</SelectItem>
              <SelectItem key="Deportes">Deportes</SelectItem>
              <SelectItem key="Ciencia">Ciencia</SelectItem>
              <SelectItem key="Arte">Arte</SelectItem>
              <SelectItem key="Negocios">Negocios</SelectItem>
              <SelectItem key="Viajes">Viajes</SelectItem>
              <SelectItem key="Política">Política</SelectItem>
              <SelectItem key="Cultura">Cultura</SelectItem>
              <SelectItem key="Estilo de vida">Estilo de vida</SelectItem>
            </Select>

            <div className="relative w-full">
              <div className="h-[150px] w-full relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300">
                <img
                  src={bannerPreview || "/placeholder-banner.png"}
                  alt="Banner preview"
                  className="w-full h-[150px] object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-white text-sm mb-2">Banner Preview</p>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <Input
                  name="banner"
                  label="Banner Profile"
                  type="file"
                  description="Upload an image for your profile banner (JPG, PNG, GIF)."
                  className="!w-full"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setBannerFile(file);
                    if (file) {
                      setBannerPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Avatar
                src={profilePreview || "/placeholder-profile.png"}
                name={title}
                size="lg"
                className="flex-shrink-0"
              />
              <div className="flex-1">
                <Input
                  name="photo"
                  label="Profile Photo"
                  type="file"
                  description="Upload an image for your profile."
                  className="!w-full"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setProfileFile(file);
                    if (file) {
                      setProfilePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
            </div>

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
