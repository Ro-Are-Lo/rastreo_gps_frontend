// src/components/UserViewModal.tsx
import React, { useEffect } from "react";
import { User } from "../models/User";
import { getUsuarioById } from "../services/usuarioService";

interface Props {
  usuario: User;
  onClose: () => void;
}
const UserViewModal: React.FC<Props> = ({ usuario, onClose }) => {
  // 🔹 Desactivar scroll al abrir modal
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
    return () => {
      document.body.style.overflow = "auto";
      document.body.classList.remove("modal-open");
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-lg p-6 w-[480px] shadow-2xl overflow-y-auto max-h-[90vh] relative">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Detalles del Usuario</h2>

        <div className="space-y-2">
          <p><strong>ID:</strong> {usuario.usuario_id}</p>
          <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido_paterno ?? ''}</p>
          <p><strong>Usuario:</strong> {usuario.username}</p>
          <p><strong>Cédula:</strong> {usuario.cedula_identidad}</p>
          <p><strong>Género:</strong> {usuario.genero ?? '—'}</p>
            <p><strong>Nacionalidad:</strong> {usuario.nacionalidad ?? '—'}</p>
            <p><strong>Licencia Número:</strong> {usuario.licencia_numero ?? '—'}</p>
            <p><strong>Licencia Categoría:</strong> {usuario.licencia_categoria ?? '—'}</p>
            <p><strong>Roles:</strong> {usuario.roles?.map((r) => (typeof r === "string" ? r : r.rol?.nombre)).join(", ") || "Sin rol"}</p>

        </div>
      </div>
    </div>
  );
};

export default UserViewModal;
