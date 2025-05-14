"use client";
import {
  Button,
  Modal,
  ModalContent,
  useDisclosure,
  Form,
  Input,
  ModalHeader,
  Alert,
} from "@heroui/react";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { register } from "../../services/auth/register";

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Maneja el estado del modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const confirmInvalid = confirmPassword !== "" && confirmPassword !== password;

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (confirmInvalid) {
      setError(true);
      setResponseMessage("Passwords do not match");
      setIsVisible(true);
      return;
    }

    try {
      const result = await register({ username, email, password });
      
      if (result.success) {
        setResponseMessage(result.message);

        // Limpiar los estados e inputs
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        // Cerrar el modal
        onClose();

        // Restablecer el estado de error
        setError(false);
        setIsVisible(false);
      } else {
        setError(true);
        setResponseMessage(`Error: ${result.error}`);
        setIsVisible(true);
      }
    } catch (error: unknown) {
      setError(true);
      if (error instanceof Error) {
        setResponseMessage(`Error inesperado: ${error.message}`);
      } else {
        setResponseMessage("Ocurrió un error desconocido");
      }
      setIsVisible(true);
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="secondary">
        Register
      </Button>
      <Modal
        size="5xl"
        className="shadow-md shadow-fuchsia-500 "
        isOpen={isOpen}
        onOpenChange={onClose}
      >
        <ModalContent className="grid sm:grid-cols-5 gap-2">
          <Image
            src="/modal_register.svg"
            alt="modal_register"
            width={600}
            height={500}
            className="size-full right-0 left-3 object-cover sm:col-span-3 hidden sm:block"
          />
          {error && isVisible && ( 
            <div className="flex items-center justify-center bottom-0 absolute">
              <div className="flex flex-col w-full">
                <div
                  key="danger"
                  className="w-full flex items-center my-3 relative"
                >
                  <Alert
                    isVisible={true} 
                    variant="faded"
                    onClose={() => setIsVisible(false)}
                    color="danger"
                    title={responseMessage}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="justify-center flex flex-col col-span-2 min-h-[620px]">
            <ModalHeader className="self-center text-3xl mt-3">
              Welcome to TalkUs
            </ModalHeader>
            <Form className="flex flex-col gap-4 m-8" onSubmit={handleRegister}>
              <Input
                isRequired
                errorMessage="Please enter a valid Username"
                label="Username"
                labelPlacement="outside"
                name="username"
                placeholder="Enter your username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                isRequired
                errorMessage="Please enter a valid email"
                label="Email"
                labelPlacement="outside"
                name="email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                isRequired
                errorMessage="Please enter a valid password"
                label="Password"
                labelPlacement="outside"
                name="password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                isRequired
                label="Confirm Password"
                labelPlacement="outside"
                name="confirmPassword"
                placeholder="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                errorMessage={
                  confirmInvalid ? "Passwords do not match" : undefined
                }
                className="mb-4"
              />
              <Button type="submit" className="bg-secondary self-center">
                Register
              </Button>
            </Form>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}