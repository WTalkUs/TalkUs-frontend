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

export default function EditBannerModal({ isOpen, onClose, onSaved }: Props) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>(
    "https://res.cloudinary.com/ddto2dyb4/image/upload/v1745378143/samples/man-portrait.jpg"
  );

  // Estados para el manejo de errores y mensajes
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditBanner = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      setError(true);
      setResponseMessage("Usuario no autenticado");
      setIsVisible(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // Aquí iría la lógica para actualizar el banner
      // Por ahora simulamos la respuesta exitosa
      // const result = await editBanner({
      //   banner: bannerFile || undefined,
      //   bannerURL: bannerFile ? undefined : (user?.bannerURL || undefined),
      // });

      // Simulación de respuesta exitosa
      setSuccess(true);
      setError(false);
      setResponseMessage("Banner actualizado exitosamente");

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
    setBannerFile(null);
    setBannerPreview(
      "https://res.cloudinary.com/ddto2dyb4/image/upload/v1745378143/samples/man-portrait.jpg"
    );
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
            Editar Banner
          </ModalHeader>

          {(error || success) && isVisible && (
            <Alert
              isVisible={true}
              variant="faded"
              color={error ? "danger" : "success"}
              title={responseMessage}
            />
          )}

          <Form onSubmit={handleEditBanner} className="space-y-6">
            {/* Banner del perfil */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Banner del Perfil</h3>
              <div className="relative">
                <div className="h-[150px] w-full relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white text-sm mb-2">
                        Vista previa del banner
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <Input
                    name="bannerURL"
                    label="Banner del Perfil"
                    type="file"
                    accept="image/*"
                    description="Sube una imagen para el banner de tu perfil (JPG, PNG, GIF)."
                    className="!w-full"
                    onChange={handleBannerFileChange}
                  />
                </div>
              </div>
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
                {isSubmitting ? "Actualizando..." : "Actualizar Banner"}
              </Button>
            </div>
          </Form>
        </ModalContent>
      </Modal>
    </>
  );
}
