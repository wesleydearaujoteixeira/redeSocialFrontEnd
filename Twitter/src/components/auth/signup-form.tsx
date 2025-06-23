"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Caminho da imagem padrão
const DEFAULT_IMAGE_PATH = "/perfil-usuario.webp";

async function getDefaultFile(): Promise<File> {
  const res = await fetch(DEFAULT_IMAGE_PATH);
  const blob = await res.blob();
  return new File([blob], "perfil-usuario.webp", { type: blob.type });
}

export const SignupForm = () => {
  const router = useRouter();
  const [nameField, setNameField] = useState("");
  const [emailField, setEmailField] = useState("");
  const [passwordField, setPasswordField] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEnterButton = async () => {
    const formData = new FormData();
    formData.append("nome", nameField);
    formData.append("email", emailField);
    formData.append("senha", passwordField);

    const defaultFile = await getDefaultFile();
    formData.append("imagem", defaultFile);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/redes/create`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.text();
      router.push("/signin");
    } catch (error) {
      console.error("Erro ao criar conta:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md w-full">
      <div className="flex items-center h-14 rounded-3xl border-2 border-gray-700">
        <input
          type="text"
          className="flex-1 outline-none bg-transparent h-full px-4 text-white placeholder-gray-400"
          placeholder="Digite seu nome"
          value={nameField}
          onChange={(e) => setNameField(e.target.value)}
        />
      </div>

      <div className="flex items-center h-14 rounded-3xl border-2 border-gray-700">
        <input
          type="email"
          className="flex-1 outline-none bg-transparent h-full px-4 text-white placeholder-gray-400"
          placeholder="Digite seu e-mail"
          value={emailField}
          onChange={(e) => setEmailField(e.target.value)}
        />
      </div>

      <div className="flex items-center h-14 rounded-3xl border-2 border-gray-700">
        <input
          type={showPassword ? "text" : "password"}
          className="flex-1 outline-none bg-transparent h-full px-4 text-white placeholder-gray-400"
          placeholder="Digite sua senha"
          value={passwordField}
          onChange={(e) => setPasswordField(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="px-4 text-sm text-gray-400"
        >
          {showPassword ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      <button
        onClick={handleEnterButton}
        className="bg-white text-black font-bold rounded-3xl py-3 hover:bg-blue-700 transition-all"
      >
        Criar conta
      </button>
    </div>
  );
};
