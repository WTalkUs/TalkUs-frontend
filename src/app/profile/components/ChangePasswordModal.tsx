"use client";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  Alert,
  Form,
  Input,
} from "@heroui/react";
import { FormEvent, useState } from "react";
import { useAuth } from "@/app/contexts/AuthProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  onSaved,
}: Props) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Estados para el manejo de errores y mensajes
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      setError(true);
      setResponseMessage("Usuario no autenticado");
      setIsVisible(true);
      return;
    }

    if (!currentPassword.trim()) {
      setError(true);
      setResponseMessage("Por favor ingresa tu contraseña actual");
      setIsVisible(true);
      return;
    }

    if (!newPassword.trim()) {
      setError(true);
      setResponseMessage("Por favor ingresa una nueva contraseña");
      setIsVisible(true);
      return;
    }

    if (newPassword.length < 6) {
      setError(true);
      setResponseMessage(
        "La nueva contraseña debe tener al menos 6 caracteres"
      );
      setIsVisible(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(true);
      setResponseMessage("Las contraseñas no coinciden");
      setIsVisible(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // Aquí iría la lógica para cambiar la contraseña
      // const result = await changePassword(currentPassword, newPassword);

      // Simulación de respuesta exitosa
      setSuccess(true);
      setError(false);
      setResponseMessage("Contraseña actualizada exitosamente");

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
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(false);
    setSuccess(false);
    setResponseMessage("");
    onClose();
  };

  return (
    <>
      <Modal
        size="md"
        className="shadow-md shadow-fuchsia-500"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <ModalContent className="p-8 pt-0 space-y-6">
          <ModalHeader className="h-8 text-2xl font-semibold pt-0 mx-auto">
            Cambiar Contraseña
          </ModalHeader>

          {(error || success) && isVisible && (
            <Alert
              isVisible={true}
              variant="faded"
              color={error ? "danger" : "success"}
              title={responseMessage}
            />
          )}

          <Form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              isRequired
              name="currentPassword"
              label="Contraseña Actual"
              placeholder="Ingresa tu contraseña actual"
              type="password"
              className="!w-full"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <Input
              isRequired
              name="newPassword"
              label="Nueva Contraseña"
              placeholder="Ingresa tu nueva contraseña"
              type="password"
              className="!w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              description="Mínimo 6 caracteres"
            />

            <Input
              isRequired
              name="confirmPassword"
              label="Confirmar Nueva Contraseña"
              placeholder="Confirma tu nueva contraseña"
              type="password"
              className="!w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="flex gap-3 pt-4">
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
                {isSubmitting ? "Actualizando..." : "Actualizar Contraseña"}
              </Button>
            </div>
          </Form>
        </ModalContent>
      </Modal>
    </>
  );
}
