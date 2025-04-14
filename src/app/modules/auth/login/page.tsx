"use client";
import { useState } from "react";
import { loginAndGetToken } from "../../../lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const token = await loginAndGetToken(email, password);
      setToken(token);
      console.log("✅ Token obtenido:", token);
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Iniciar sesión</button>

      {token && <p>Token: {token}</p>}
    </div>
  );
}
