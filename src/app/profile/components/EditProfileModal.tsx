"use client";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  Alert,
  Form,
  Input,
  Avatar,
} from "@heroui/react";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthProvider";
import { editProfile } from "@/app/services/auth/edit";
import { getUserById } from "@/app/services/auth/getById";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: Props) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>(
    user?.displayName || ""
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(
    user?.photoURL || ""
  );

  // Estados para el manejo de errores y mensajes
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleEditProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      setError(true);
      setResponseMessage("Usuario no autenticado");
      setIsVisible(true);
      return;
    }

    if (!displayName.trim()) {
      setError(true);
      setResponseMessage("Please enter a username");
      setIsVisible(true);
      return;
    }

    // Removemos la validación obligatoria de la foto para permitir actualizar solo el nombre
    setIsSubmitting(true);

    try {
      const result = await editProfile({
        displayName,
        photo: photoFile || undefined,
      });

      if (result.success) {
        setSuccess(true);
        setError(false);
        setResponseMessage(result.message);

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

  const handleClose = () => {
    setDisplayName(user?.displayName || "");
    setPhotoFile(null);
    setPhotoPreview(user?.photoURL || "");
    setError(false);
    setSuccess(false);
    setResponseMessage("");
    onClose();
  };

  return (
    <>
      <Modal
        size="lg"
        className="shadow-md shadow-fuchsia-500"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <ModalContent className="p-6 pt-0 space-y-6">
          <ModalHeader className="h-8 text-xl font-semibold pt-0 mx-auto">
            Edit Profile
          </ModalHeader>

          {(error || success) && isVisible && (
            <Alert
              isVisible={true}
              variant="faded"
              color={error ? "danger" : "success"}
              title={responseMessage}
            />
          )}

          <Form onSubmit={handleEditProfile} className="space-y-6">
            {/* Foto de perfil */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Profile Photo</h3>
              <div className="flex items-center gap-4">
                <Avatar
                  src={photoPreview}
                  name={displayName}
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
                      setPhotoFile(file);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Nombre de usuario */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <Input
                isRequired
                name="displayName"
                label="Username"
                placeholder="Enter your username"
                type="text"
                className="!w-full"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                description="This will be your visible name in the application"
              />
            </div>

            <div className="flex gap-3 pt-4 items-center">
              <Button
                type="button"
                variant="bordered"
                className="flex-1"
                onPress={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="secondary"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </Form>
        </ModalContent>
      </Modal>
    </>
  );
}
