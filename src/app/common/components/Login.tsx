"use client";
import { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  useDisclosure,
  Form,
  Input,
} from "@heroui/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [action, setAction] = useState(null);

  const handleLogin = async (data: any) => {
    try {
      const formData = new FormData(data);
      //console.log("FormData:", formData);
      //const token = await loginAndGetToken(email, password);
      setToken(token);
      console.log("✅ Token obtenido:", token);
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
    }
  };

  return (
    <>
      <Button onPress={onOpen}>Login</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Form submitted:", e.currentTarget);
              handleLogin(e.currentTarget);
            }}
          >
            <Input
              isRequired
              errorMessage="Please enter a valid email"
              label="Email"
              labelPlacement="outside"
              name="email"
              placeholder="Enter your email"
              type="email"
              className="mb-4 w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
            />
            <Input
              isRequired
              errorMessage="Please enter a valid password"
              label="Password"
              labelPlacement="outside"
              name="password"
              placeholder="Enter your password"
              type="password"
            />
            <Button color="primary" type="submit">
              Iniciar sesión
            </Button>
          </Form>
        </ModalContent>
      </Modal>
      {token && <p>Token: {token}</p>}
    </>
  );
}
