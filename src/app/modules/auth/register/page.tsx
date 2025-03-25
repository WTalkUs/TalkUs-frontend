"use client";

import { useState, FormEvent } from "react";

export default function RegisterPage() {
  // Estados para email, password y mensaje de respuesta
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
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        // Extraer mensaje de error de la respuesta
        const errorText = await res.text();
        throw new Error(errorText);
      }
      const data = await res.json();
      setResponseMessage(`Usuario registrado: ${data.rawId}`);
    } catch (error: unknown) {
        if (error instanceof Error) {
          setResponseMessage(`Error: ${error.message}`);
        } else {
          setResponseMessage("Ocurrió un error desconocido");
        }
      }
      
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Registro de Usuario</h1>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email">Email:</label>
          <br />
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="password">Contraseña:</label>
          <br />
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "var(--store-primary-color)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Registrarse
        </button>
      </form>
      {responseMessage && <p style={{ marginTop: "1rem" }}>{responseMessage}</p>}
    </div>
  );
}
