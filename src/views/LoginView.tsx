// src/views/LoginView.tsx
import React from "react";
import { useLoginViewModel } from "../viewmodels/LoginViewModel";
import { useAuth } from "../context/AuthContext";

export default function LoginView() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
    user,
  } = useLoginViewModel();

  const { login } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin();
    if (user) {
      const token = localStorage.getItem("token") || "";
      login(user, token);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen
        bg-gradient-to-r from-[#032663] via-[#014B97] to-[#4685D2]
        animate-gradient-x font-sans">

      {/* Contenedor de inputs y botones */}
      <div className="w-full max-w-md p-8 space-y-8
          bg-gradient-to-r from-[#032663] to-[#014B97]  /* Color diferente del fondo */
          rounded-lg shadow-lg
          animate-fadeIn">

        {/* Título */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#F8FAFC] ">
            Bienvenido
          </h2>
          <p className="mt-2 text-sm text-[#C0C0C0]">
            GPS Arevalo Sur
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-5 py-3 border border-[#555567] rounded-lg
                         bg-[#032663] text-[#F8FAFC] placeholder:text-[#C0C0C0]
                         focus:outline-none focus:ring-2 focus:ring-[#2563EB]
                         transition-all duration-300"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 border border-[#555567] rounded-lg
                         bg-[#032663] text-[#F8FAFC] placeholder:text-[#C0C0C0]
                         focus:outline-none focus:ring-2 focus:ring-[#2563EB]
                         transition-all duration-300"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center text-[#DC2626] bg-[#DC2626]/20 border border-[#DC2626]/50 p-3 rounded-md text-sm animate-fadeIn">
              <span className="ml-2">{error || "No hay conexión"}</span>
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-[#2563EB]
                        ${loading
                          ? "bg-[#4685D2]/50 cursor-not-allowed text-white"
                          : "bg-[#4685D2] hover:bg-[#1D4ED8] active:scale-95 text-white shadow-md hover:shadow-lg"
                        }`}
          >
            {loading ? "Iniciando sesión..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

