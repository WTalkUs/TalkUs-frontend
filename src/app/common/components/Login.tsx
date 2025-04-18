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
} from "@heroui/react";
import { loginAndGetToken } from "@lib/auth";
import Image from "next/image";
import { parseFirebaseAuthError } from "@lib/baseAuthError";

export default function LoginPage() {
  const [token, setToken] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [errorMessage, setErrorMessage] = useState<
    Record<string, string | string[]>
  >({});

  const handleLogin = async (data: any) => {
    try {
      data.preventDefault();
      const formData = Object.fromEntries(new FormData(data.currentTarget));

      const email = formData.email as string;
      const password = formData.password as string;

      if (!email) {
        setErrorMessage({
          email: "El correo electrónico es obligatorio",
        });
        return;
      }

      const token = await loginAndGetToken(email, password);
      setToken(token);
      console.log("✅ Token obtenido:", token);
    } catch (error) {
      const errorMessage = parseFirebaseAuthError(error);
      setErrorMessage({ general: errorMessage });
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
          <Image
            src="/modal_login.svg"
            alt="modal_login"
            width={600}
            height={500}
            className="right-0 top-2 left-2 col-span-3"
          />
          <div className="col-span-2 justify-center flex flex-col">
            <ModalHeader className="self-center text-3xl">
              Bienvenido a TalkUs
            </ModalHeader>
            <Form
              className="flex flex-col gap-4 m-8"
              validationErrors={errorMessage}
              onSubmit={handleLogin}
            >
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
              <Button color="secondary" type="submit" className="self-center">
                Login
              </Button>
            </Form>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
