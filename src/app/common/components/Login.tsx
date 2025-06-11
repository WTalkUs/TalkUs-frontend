"use client";
import { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Form,
  Input,
  Alert,
} from "@heroui/react";
import { loginAndGetToken } from "@services/auth/login";
import Image from "next/image";
import { parseFirebaseAuthError } from "@lib/baseAuthError";

export default function LoginModal() {
  const [token, setToken] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [errors, setErrors] = useState<string | null>(null);

  const handleLogin = async (data: any) => {
    data.preventDefault();
    const formData = Object.fromEntries(new FormData(data.currentTarget));
    const email = formData.email as string;
    const password = formData.password as string;
    try {
      const token = await loginAndGetToken(email, password);
      setToken(token);
      onOpenChange();
    } catch (error) {
      const errorMessage = parseFirebaseAuthError(error);
      setErrors(errorMessage);
    }
  };

  return (
    <>
      <Button onPress={onOpen}>Login</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        className="shadow-md shadow-fuchsia-500"
      >
        <ModalContent className="grid grid-cols-5 gap-2 ">
          {(onClose) => (
            <>
              <Image
                src="/modal_login.svg"
                alt="modal_login"
                width={700}
                height={700}
                className="right-0 top-2 left-2 col-span-3"
              />
              <div className="col-span-2 justify-center flex flex-col">
                <ModalHeader className="self-center text-3xl">
                  Bienvenido a TalkUs
                </ModalHeader>

                <Form
                  className="flex flex-col gap-4 mx-8"
                  onSubmit={handleLogin}
                >
                  <Alert
                    isVisible={errors != null}
                    className="self-center"
                    description={errors}
                    title="Error"
                    color="danger"
                  />
                  <Input
                    isRequired
                    label="Email"
                    labelPlacement="outside"
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Input
                    isRequired
                    label="Password"
                    labelPlacement="outside"
                    name="password"
                    placeholder="Enter your password"
                    type="password"
                  />
                  <Button
                    color="secondary"
                    type="submit"
                    className="self-center"
                  >
                    Iniciar sesión
                  </Button>
                </Form>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
