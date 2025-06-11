"use client";
import { useState } from "react";
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
  Alert,
} from "@heroui/react";
import { loginAndGetToken } from "@services/auth/login";
import Image from "next/image";
import { parseFirebaseAuthError } from "@lib/baseAuthError";
import { createGroup } from "@services/groups/create";

export default function LoginModal({
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

  const handleCreateGroup = async (data: any) => {
    data.preventDefault();
    const formData = Object.fromEntries(new FormData(data.currentTarget));
    const groupName = formData.groupName as string;
    const description = formData.description as string;
    try {
      // Here you would call your API to create the group
      // For example:
      // await createGroup({ groupName, description });
      const response = createGroup({
        Title: groupName,
        Description: description,
        Category: "General", 
      });

      console.log("Group created:", response);
      if (onClose) onClose();
    } catch (error) {
      const errorMessage = parseFirebaseAuthError(error);
      console.error("Error creating group:", errorMessage);
      // Handle error, e.g., show an alert
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
              {/* <Image
                src="/modal_login.svg"
                alt="modal_login"
                width={700}
                height={700}
                className="right-0 top-2 left-2 col-span-3"
              /> */}

              <ModalHeader className="flex flex-col gap-2">
                <span className="text-3xl pt-4">
                  Tell us about your new group
                </span>
                <span className="text-sm">
                  A name and description help people understand what your group
                  is all about.
                </span>
              </ModalHeader>
              <ModalBody className="grid grid-cols-5 gap-8">
                <div className="col-span-3 justify-center flex flex-col">
                  <Form
                    className="flex flex-col gap-8 "
                    onSubmit={handleCreateGroup}
                    id="create-group-form"
                  >
                    <Input
                      isRequired
                      label="Group Name"
                      labelPlacement="inside"
                      name="groupName"
                      placeholder="Enter your group name"
                      type="text"
                    />
                    <Textarea
                      isRequired
                      label="Description"
                      labelPlacement="inside"
                      name="description"
                      placeholder="Enter a description for your group"
                      minRows={12}
                    />
                  </Form>
                </div>
                <div className="col-span-2">
                  <Card>
                    <CardHeader>
                      <h4 className="text-default-900 font-semibold">
                        g/groupname
                      </h4>
                    </CardHeader>
                    <CardBody className="flex flex-col gap-2">
                      <p className="text-sm text-default-500">
                        This is a preview of how your group will look like.
                      </p>
                    </CardBody>
                  </Card>
                </div>
              </ModalBody>
              <ModalFooter className="flex w-full justify-end">
                <Button
                  onPress={() => {
                    if (onClose) onClose();
                    modalOnClose();
                  }}
                >
                  Cancel
                </Button>
                <Button color="secondary" type="submit" form="create-group-form">
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
