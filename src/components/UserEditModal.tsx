// src/components/UserEditModal.tsx
import { useState, useEffect } from "react";
import { updateUsuario } from "../services/usuarioService";
import type { User } from "../models/User";

interface Props {
  usuario: User;
  onClose: () => void;
  onEdit: (usuario: User) => void;
}

const UserEditModal: React.FC<Props> = ({ usuario, onClose, onEdit }) => {
  // Extraer datos del usuario
  const [form, setForm] = useState({
    nombre: usuario.persona?.nombre || usuario.nombre || "",
    apellido_paterno: usuario.persona?.apellido_paterno || usuario.apellido_paterno || "",
    apellido_materno: usuario.persona?.apellido_materno || usuario.apellido_materno || "",
    username: usuario.username || "",
    genero: usuario.persona?.genero || usuario.genero || "M",
    roles: usuario.roles || ["CONDUCTOR"] as string[],
    password: "",
    
    // ✅ Solo campos que tu backend acepta
    email: usuario.contactos?.find((c: any) => c.tipo === 'EMAIL')?.valor || "",
    telefono: usuario.contactos?.find((c: any) => c.tipo === 'TELEFONO')?.valor || "",

    cedula_identidad: usuario.cedula_identidad || usuario.documentos?.find(d => d.tipo === 'CEDULA')?.numero || "",
    foto_url: usuario.persona?.foto_url || usuario.foto_url || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userId = usuario.id || usuario.usuario_id;
      if (!userId) throw new Error('ID de usuario no encontrado');

      await updateUsuario(userId, {
        nombre: form.nombre,
        apellido_paterno: form.apellido_paterno,
        apellido_materno: form.apellido_materno,
        username: form.username,
        genero: form.genero,
        roles: form.roles,
        
        // ✅ Solo estos campos opcionales
        ...(form.email && { email: form.email }),
        ...(form.telefono && { telefono: form.telefono }),
        ...(form.cedula_identidad && { cedula_identidad: form.cedula_identidad }),
        ...(form.foto_url && { foto_url: form.foto_url }),
        ...(form.password && { password: form.password }),
      });

      // Actualizar datos del usuario
      const updatedUser: User = {
        ...usuario,
        username: form.username,
        nombre: form.nombre,
        apellido_paterno: form.apellido_paterno,
        apellido_materno: form.apellido_materno,
        genero: form.genero,
        roles: form.roles,
        foto_url: form.foto_url,
        
        cedula_identidad: form.cedula_identidad,
        
        // Actualizar persona si existe
        persona: usuario.persona ? {
          ...usuario.persona,
          nombre: form.nombre,
          apellido_paterno: form.apellido_paterno,
          apellido_materno: form.apellido_materno,
          genero: form.genero,
          foto_url: form.foto_url,
        } : undefined,
      };

      onEdit(updatedUser);
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al actualizar usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-lg p-6 w-[480px] shadow-2xl overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Editar Usuario</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre *</label>
              <input
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Apellido Paterno *</label>
              <input
                name="apellido_paterno"
                placeholder="Apellido Paterno"
                value={form.apellido_paterno}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Apellido Materno</label>
            <input
              name="apellido_materno"
              placeholder="Apellido Materno"
              value={form.apellido_materno}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Usuario *</label>
              <input
                name="username"
                placeholder="Nombre de usuario"
                value={form.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Rol *</label>
              <select
                name="roles"
                value={form.roles[0]}
                onChange={(e) => setForm({...form, roles: [e.target.value]})}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="CONDUCTOR">Conductor</option>
                <option value="ADMIN">Administrador</option>
                <option value="SUPERVISOR">Supervisor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Género</label>
              <select
                name="genero"
                value={form.genero}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Nueva Contraseña</label>
              <input
                name="password"
                type="password"
                placeholder="Dejar vacío para no cambiar"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          {/* ✅ Solo campos que tu backend acepta */}
          <div className="border-t pt-3">
            <h3 className="font-medium mb-2">Información adicional</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="email@ejemplo.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <input
                  name="telefono"
                  placeholder="77788899"
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">Cédula de Identidad</label>
              <input
                name="cedula_identidad"
                placeholder="1234567"
                value={form.cedula_identidad}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">Foto URL</label>
              <input
                name="foto_url"
                placeholder="https://ejemplo.com/foto.jpg"
                value={form.foto_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;