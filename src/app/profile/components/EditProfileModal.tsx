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
import { FormEvent, useState } from "react";
import { useAuth } from "@/app/contexts/AuthProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function EditProfileModal({ isOpen, onClose, onSaved }: Props) {
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

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      setResponseMessage("Por favor ingresa un nombre de usuario");
      setIsVisible(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // Aquí iría la lógica para actualizar el perfil
      // const result = await editProfile({
      //   displayName: displayName.trim(),
      //   photoURL: photoFile ? await uploadPhoto(photoFile) : user.photoURL,
      // });

      // Simulación de respuesta exitosa
      setSuccess(true);
      setError(false);
      setResponseMessage("Perfil actualizado exitosamente");

      setTimeout(() => {
        onClose();
        setIsVisible(false);
        onSaved?.();
      }, 1500);
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
            Editar Perfil
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
              <h3 className="text-lg font-medium">Foto de Perfil</h3>
              <div className="flex items-center gap-4">
                <Avatar
                  src={photoPreview}
                  name={displayName}
                  size="lg"
                  className="flex-shrink-0"
                />
                <div className="flex-1">
                  <Input
                    name="photoURL"
                    label="Foto de Perfil"
                    type="file"
                    accept="image/*"
                    description="Sube una imagen para tu perfil (JPG, PNG, GIF). Recomendado: 200x200px"
                    className="!w-full"
                    onChange={handlePhotoFileChange}
                  />
                </div>
              </div>
            </div>

            {/* Nombre de usuario */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Información Personal</h3>
              <Input
                isRequired
                name="displayName"
                label="Nombre de Usuario"
                placeholder="Ingresa tu nombre de usuario"
                type="text"
                className="!w-full"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                description="Este será tu nombre visible en la aplicación"
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
                Cancelar
              </Button>
              <Button
                type="submit"
                color="secondary"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Actualizando..." : "Actualizar Perfil"}
              </Button>
            </div>
          </Form>
        </ModalContent>
      </Modal>
    </>
  );
}
