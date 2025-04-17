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

import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";

export default function Register() {
  // Estados para email, password y mensaje de respuesta
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Maneja el estado del modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isVisible, setIsVisible] = useState(true);

  const [responseMessage, setResponseMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const confirmInvalid = confirmPassword !== "" && confirmPassword !== password;


  // Maneja el envío del formulario
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (confirmInvalid) {
      setError(true);
      setResponseMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/public/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      if (!res.ok) {
        // Extraer mensaje de error de la respuesta
        const errorText = await res.text();
        throw new Error(errorText);
      }
      const data = await res.json();
      setResponseMessage(`Usuario registrado correctamente`);

      // Limpiar los estados e inputs
      setUsername("");
      setEmail("");
      setPassword("");

      // Cerrar el modal
      onClose();

      // Restablecer el estado de error
      setError(false);
      setIsVisible(false);

    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(true);
        setResponseMessage(`Error: ${error.message}`);
      } else {
        setResponseMessage("Ocurrió un error desconocido");
      }

      // Asegurarse de que la alerta sea visible
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
          {error && (
            <div className="flex items-center justify-center bottom-0 absolute">
              <div className="flex flex-col w-full">
                <div
                  key="danger"
                  className="w-full flex items-center my-3 relative"
                >
                  <Alert
                    isVisible={isVisible}
                    variant="faded"
                    onClose={() => setIsVisible(false)}
                    color="danger"
                    title={responseMessage}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="justify-center flex flex-col col-span-2">
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
              className="mb-2"
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
              className="mb-2"
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
              className="mb-2"
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
