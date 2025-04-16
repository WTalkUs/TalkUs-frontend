"use client";
import {
  Button,
  Modal,
  ModalContent,
  useDisclosure,
  Form,
  Input,
  ModalHeader,
} from "@heroui/react";

import { useState, FormEvent } from "react";
import Image from "next/image";

export default function Register() {
  // Estados para email, password y mensaje de respuesta
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [responseMessage, setResponseMessage] = useState<string>("");

  // Maneja el envío del formulario
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      console.log("DATA", data);
      setResponseMessage(`Usuario registrado: ${data.rawId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResponseMessage(`Error: ${error.message}`);
      } else {
        setResponseMessage("Ocurrió un error desconocido");
      }
    }
  };

  // Maneja el estado del modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} color="secondary">Register</Button>
      <Modal
        size="5xl"
        className="shadow-md shadow-fuchsia-500"
        isOpen={isOpen}
        onOpenChange={onClose}
      >
        <ModalContent className="grid grid-cols-2 gap-2 ">
          <Image
            src="/modal_register.svg"
            alt="modal_register"
            width={600}
            height={500}
            className="size-full right-0 left-3 object-cover "
          />
          <div className="justify-center flex flex-col ">
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
                required
              />
              <Input
                isRequired
                errorMessage="Please confirm your password"
                label="Confirm Password"
                labelPlacement="outside"
                name="confirmPassword"
                placeholder="Confirm password"
                type="password"
                className="mb-4"
              />

              <Button type="submit" className="bg-secondary self-center">
                Register
              </Button>
            </Form>
          </div>
          {responseMessage && (
            <p style={{ marginTop: "1rem" }}>{responseMessage}</p>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
