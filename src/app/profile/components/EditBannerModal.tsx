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
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthProvider";
import { editProfile } from "@/app/services/auth/edit";
import { getUserById } from "@/app/services/auth/getById";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function EditBannerModal({ isOpen, onClose, onSaved }: Props) {
  const { user, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>(
    "https://res.cloudinary.com/ddto2dyb4/image/upload/v1745378143/samples/man-portrait.jpg"
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Estados para el manejo de errores y mensajes
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      // Solo intentar cargar datos si el usuario está autenticado y no estamos cargando
      if (user && !authLoading) {
        setIsLoading(true);
        const result = await getUserById();
        if (result.success && result.data) {
          setBannerPreview(result.data.banner_image);
        }
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [user, authLoading]);

  const handleEditBanner = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      setError(true);
      setResponseMessage("Usuario no autenticado");
      setIsVisible(true);
      return;
    }

    if (!bannerFile) {
      setError(true);
      setResponseMessage("No se ha seleccionado ninguna imagen");
      setIsVisible(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await editProfile({
        displayName: user.displayName || "",
        banner: bannerFile,
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
              <h3 className="text-lg font-medium">Banner Profile</h3>
              <div className="relative">
                <div className="h-[150px] w-full relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300">
                  <img
                    src={bannerPreview}
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
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 items-center justify-center w-full">
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
                className="flex-1 "
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </div>
          </Form>
        </ModalContent>
      </Modal>
    </>
  );
}
