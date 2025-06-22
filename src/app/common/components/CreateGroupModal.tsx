"use client";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Form,
  Input,
  Textarea,
  ModalFooter,
  Card,
  CardHeader,
  CardBody,
  PressEvent,
  Select,
  SelectItem,
  addToast,
} from "@heroui/react";
import { parseFirebaseAuthError } from "@lib/baseAuthError";
import { createGroup } from "@services/groups/create";
import GroupPreviewCard from "./GroupPreviewCard";

export default function CreateGroupModal({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure({
    isOpen: open ?? false,
    onChange: (open) => {
      if (!open && onClose) {
        onClose();
      }
    },
  });

  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [tag, setTags] = useState<string[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoBannerFile, setPhotoBannerFile] = useState<File | null >(null);
  const [previewBannerUrl, setPreviewBannerUrl] = useState<string | null >(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
  });
  const formRef = useRef<HTMLFormElement>(null);

  const updateFormField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagsChange = (keys: any) => {
    const selectedTags = Array.from(keys) as string[];
    if (selectedTags.length > 3) {
      addToast({
        title: "Warning",
        description: "You can only select up to 3 tags.",
        color: "warning",
      });
      return;
    }
    setTags(selectedTags);
  };

  const handleNext = (e: PressEvent) => {
    if (formRef.current && formRef.current.reportValidity()) {
      setStep((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (photoBannerFile) {
      const objectUrl = URL.createObjectURL(photoBannerFile);
      setPreviewBannerUrl(objectUrl);

      // Limpia la memoria al cambiar o desmontar
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewBannerUrl(null);
    }
  }, [photoBannerFile]);

  useEffect(() => {
    if (photoFile) {
      const objectUrl = URL.createObjectURL(photoFile);
      setPreviewPhotoUrl(objectUrl);

      // Limpia la memoria al cambiar o desmontar
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewPhotoUrl(null);
    }
  }, [photoFile]);

  const handleCreateGroup = async (data: any) => {
    setIsCreating(true);
    data.preventDefault();

    try {
      const response = await createGroup({
        Title: formData.groupName,
        Description: formData.description,
        Categories: tag,
        BannerURL: photoBannerFile ?? undefined,
        IconURL: photoFile ?? undefined,
      });
      if (response.success) {
        addToast({
          title: "Success",
          description: "Group created successfully!",
          color: "success",
        });
        setFormData({
          groupName: "",
          description: "",
        });
        setTags([]);
        setPhotoFile(null);
        setPhotoBannerFile(null);
        setPreviewBannerUrl(null);
        setPreviewPhotoUrl(null);
        setStep(1);
      }
      setIsCreating(false);
      if (onClose) onClose();
    } catch (error) {
      const errorMessage = parseFirebaseAuthError(error);
      console.error("Error creating group:", errorMessage);
      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          if (onClose) onClose();
        }}
        size="3xl"
        className="shadow-md shadow-fuchsia-500"
      >
        <ModalContent>
          {(modalOnClose) => (
            <>
              <ModalHeader className="flex flex-col gap-2">
                <span className="text-3xl pt-4">
                  Tell us about your new group
                </span>
                <span className="text-sm">
                  {step === 1 && "A name and description help people understand what your group is all about."}
                  {step === 2 && "Add a photo and banner to make your group visually appealing."}
                  {step === 3 && "Select tags that best describe your group to help others find it."}
                </span>
              </ModalHeader>
              <ModalBody className="grid grid-cols-5 gap-8">
                <div className="col-span-3 justify-center flex flex-col">
                  <Form
                    ref={formRef}
                    className="flex flex-col gap-8"
                    onSubmit={handleCreateGroup}
                    id="create-group-form"
                  >
                    {step === 1 && (
                      <>
                        <Input
                          isRequired
                          label="Group Name"
                          labelPlacement="inside"
                          name="groupName"
                          placeholder="Enter your group name"
                          type="text"
                          value={formData.groupName}
                          onChange={(e) =>
                            updateFormField("groupName", e.target.value)
                          }
                        />
                        <Textarea
                          isRequired
                          label="Description"
                          labelPlacement="inside"
                          name="description"
                          placeholder="Enter a description for your group"
                          minRows={12}
                          value={formData.description}
                          onChange={(e) =>
                            updateFormField("description", e.target.value)
                          }
                        />
                      </>
                    )}
                    {step === 2 && (
                      <div className="flex-1">
                        <Input
                          name="photo"
                          label="Group Photo"
                          type="file"
                          accept="image/*"
                          description="Upload an image for your group."
                          className="!w-full"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            setPhotoFile(file);
                          }}
                        />
                        <Input
                          name="photo"
                          label="Group Banner"
                          type="file"
                          accept="image/*"
                          description="Upload an image for your banner."
                          className="!w-full"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            setPhotoBannerFile(file);
                          }}
                        />
                      </div>
                    )}
                    {step === 3 && (
                      <Select
                        name="tags"
                        label="Tag"
                        placeholder="Select a tag"
                        className="!w-full"
                        selectedKeys={new Set(tag)}
                        selectionMode="multiple"
                        onSelectionChange={handleTagsChange}
                      >
                        <SelectItem key="Tecnología">Tecnología</SelectItem>
                        <SelectItem key="Salud">Salud</SelectItem>
                        <SelectItem key="Educación">Educación</SelectItem>
                        <SelectItem key="Entretenimiento">
                          Entretenimiento
                        </SelectItem>
                        <SelectItem key="Deportes">Deportes</SelectItem>
                        <SelectItem key="Ciencia">Ciencia</SelectItem>
                        <SelectItem key="Arte">Arte</SelectItem>
                        <SelectItem key="Negocios">Negocios</SelectItem>
                        <SelectItem key="Viajes">Viajes</SelectItem>
                        <SelectItem key="Política">Política</SelectItem>
                        <SelectItem key="Cultura">Cultura</SelectItem>
                        <SelectItem key="Estilo de vida">
                          Estilo de vida
                        </SelectItem>
                      </Select>
                    )}
                  </Form>
                </div>
                <div className="col-span-2 w-full">
                  {step === 1 && (
                    <Card>
                      <CardHeader>
                        <h4 className="text-default-900 font-semibold">
                          g/{formData.groupName || "groupname"}
                        </h4>
                      </CardHeader>
                      <CardBody className="flex flex-col gap-2">
                        <p className="text-sm text-default-500">
                          {formData.description ||
                            "This is a placeholder description for your group."}
                        </p>
                      </CardBody>
                    </Card>
                  )}
                  {step === 2 && (
                    <GroupPreviewCard
                      name={formData.groupName}
                      description={formData.description}
                      bannerUrl={previewBannerUrl ?? '/placeholder-banner.png'}
                      photoUrl={previewPhotoUrl ?? ''}
                      members={1}
                      online={1}
                    />
                  )}
                </div>
              </ModalBody>
              <ModalFooter className="flex w-full justify-end">
                <div className="flex gap-2">
                  {step > 1 && (
                    <Button onPress={() => setStep(step - 1)} type="button">
                      Back
                    </Button>
                  )}
                  <Button onPress={onClose}>Cancel</Button>
                </div>

                <div className="flex gap-2">
                  {step < 3 ? (
                    <Button
                      color="secondary"
                      onPressStart={handleNext}
                      type="button"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      color="secondary"
                      isLoading={isCreating}
                      type="submit"
                      form="create-group-form"
                    >
                      Create
                    </Button>
                  )}
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
