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
import { changeEmail } from "@/app/services/auth/change-email";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function EditEmailModal({ isOpen, onClose, onSaved }: Props) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>("");

  // Estados para el manejo de errores y mensajes
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleEditEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      setError(true);
      setResponseMessage("Usuario no autenticado");
      setIsVisible(true);
      return;
    }

    if (!newEmail.trim()) {
      setError(true);
      setResponseMessage("Por favor ingresa un nuevo correo electrónico");
      setIsVisible(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await changeEmail({ newEmail });

      if (result.success) {
        setSuccess(true);
        setError(false);
        setResponseMessage("Correo electrónico actualizado exitosamente");
        setTimeout(() => {
          onClose();
          setIsVisible(false);
          onSaved?.();
        }, 1500);
      } else {
        setError(true);
        setSuccess(false);
        setResponseMessage(result.error);
      }
    } catch (error: unknown) {
      setError(true);
      setResponseMessage("Ocurrió un error desconocido");
      setIsVisible(true);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNewEmail("");
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
            Cambiar Correo Electrónico
          </ModalHeader>

          {(error || success) && isVisible && (
            <Alert
              isVisible={true}
              variant="faded"
              color={error ? "danger" : "success"}
              title={responseMessage}
            />
          )}

          <Form onSubmit={handleEditEmail} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Correo actual:{" "}
                <span className="font-medium">{user?.email}</span>
              </p>
            </div>

            <Input
              isRequired
              name="newEmail"
              label="Nuevo Correo Electrónico"
              placeholder="Ingresa tu nuevo correo electrónico"
              type="email"
              className="!w-full"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
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
                {isSubmitting ? "Actualizando..." : "Actualizar Correo"}
              </Button>
            </div>
          </Form>
        </ModalContent>
      </Modal>
    </>
  );
}
