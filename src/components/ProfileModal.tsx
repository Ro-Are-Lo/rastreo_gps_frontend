// src/components/ProfileModal.tsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUsuario } from "../services/usuarioService";

interface Props {
  onClose: () => void;
}

const ProfileModal: React.FC<Props> = ({ onClose }) => {
  const { user, setUser } = useAuth(); // asegurate que tu context tenga setUser
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nombre: user?.nombre || "",
    apellido_paterno: user?.apellido_paterno || "",
    apellido_materno: user?.apellido_materno || "",
    username: user?.username || "",
    cedula_identidad: user?.cedula_identidad || "",
    nacionalidad: user?.nacionalidad || "",
    licencia_numero: user?.licencia_numero || "",
    licencia_categoria: user?.licencia_categoria || "",

  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    try {
      const updatedUser = await updateUsuario(user!.usuario_id, form);
      setUser(updatedUser); // actualizar contexto
      setEditing(false);
    } catch (err: any) {
      setError(err.message || "Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[2000] text-black">
      <div className="bg-white rounded-lg p-6 w-[480px] shadow-2xl overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Mi Perfil</h2>

        <div className="space-y-2">
          {editing ? (
            <>
              <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="w-full px-3 py-2 border rounded" />
              <input name="apellido_paterno" value={form.apellido_paterno} onChange={handleChange} placeholder="Apellido Paterno" className="w-full px-3 py-2 border rounded" />
              <input name="apellido_materno" value={form.apellido_materno} onChange={handleChange} placeholder="Apellido Materno" className="w-full px-3 py-2 border rounded" />
              <input name="username" value={form.username} onChange={handleChange} placeholder="Usuario" className="w-full px-3 py-2 border rounded" />
              <input name="cedula_identidad" value={form.cedula_identidad} onChange={handleChange} placeholder="Cédula" className="w-full px-3 py-2 border rounded" />
              <input name="nacionalidad" value={form.nacionalidad} onChange={handleChange} placeholder="Nacionalidad" className="w-full px-3 py-2 border rounded" />
              <input name="licencia_numero" value={form.licencia_numero} onChange={handleChange} placeholder="Licencia Número" className="w-full px-3 py-2 border rounded" />
              <input name="licencia_categoria" value={form.licencia_categoria} onChange={handleChange} placeholder="Licencia Categoría" className="w-full px-3 py-2 border rounded" />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </>
          ) : (
            <>
              <p><strong>Nombre:</strong> {user?.nombre} {user?.apellido_paterno} {user?.apellido_materno}</p>
              <p><strong>Usuario:</strong> {user?.username}</p>


              <p><strong>Cédula:</strong> {user?.cedula_identidad}</p>
              <p><strong>Nacionalidad:</strong> {user?.nacionalidad}</p>
                <p><strong>Licencia Número:</strong> {user?.licencia_numero}</p>
                <p><strong>Licencia Categoría:</strong> {user?.licencia_categoria}</p>
                
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancelar</button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Editar</button>
              
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
