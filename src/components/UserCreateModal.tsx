// src/components/UserCreateModal.tsx
import { useState, useEffect } from 'react';
import { createUsuario } from '../services/usuarioService';
import type { User } from "../models/User";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (user: User) => void;
}

const UserCreateModal: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  
  const [form, setForm] = useState({
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  genero: "M",
  foto_url: "",
  username: "",
  password: "", // 🔥 NUEVO: Campo requerido
  roles: ["CONDUCTOR"],
  email: "",
  telefono: "",
  cedula_identidad: "",
});



  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validar campos requeridos
      if (!form.nombre || !form.apellido_paterno || !form.username || !form.password) {
        throw new Error('Por favor complete todos los campos requeridos');
      }

      // ✅ Enviar solo los campos que tu backend acepta
      const response = await createUsuario({
        nombre: form.nombre,
        apellido_paterno: form.apellido_paterno,
        apellido_materno: form.apellido_materno,
        username: form.username,
        password: form.password,
        roles: form.roles,
        genero: form.genero,
        
        // ✅ Solo estos campos opcionales:
        ...(form.email && { email: form.email }),
        ...(form.telefono && { telefono: form.telefono }),
        ...(form.cedula_identidad && { cedula_identidad: form.cedula_identidad }),
        ...(form.foto_url && { foto_url: form.foto_url }),
        
        // ❌ NO enviar estos:
        // nacionalidad: form.nacionalidad, ← NO
        // licencia_numero: form.licencia_numero, ← NO
        // licencia_categoria: form.licencia_categoria ← NO
      });

      // Transformar respuesta a formato User
      const userData: User = {
        id: response.data?.usuario?.id,
        usuario_id: response.data?.usuario?.id,
        username: response.data?.usuario?.username,
        nombre: response.data?.persona?.nombre,
        apellido_paterno: response.data?.persona?.apellido_paterno,
        apellido_materno: response.data?.persona?.apellido_materno,
        genero: response.data?.persona?.genero,
        roles: form.roles,
        cedula_identidad: form.cedula_identidad,
        
        persona: response.data?.persona,
        contactos: response.data?.contactos,
        documentos: response.data?.documentos,
      };

      onCreate(userData);
      onClose();
      
      // Reset form
      setForm({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        username: '',
        password: '',
        roles: ['CONDUCTOR'],
        genero: 'M',
        email: '',
        telefono: '',
        cedula_identidad: '',
        foto_url: '',
      });
      
    } catch (err: any) {
      setError(err.message || 'Error al crear usuario.');
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

        <h2 className="text-xl font-bold mb-4 text-center">Crear Nuevo Usuario</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Campos obligatorios */}
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
              <label className="block text-sm font-medium mb-1">Contraseña *</label>
              <input
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
                minLength={6}
              />
            </div>

          </div>

          <div className="grid grid-cols-2 gap-3">
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
          </div>

          {/* ✅ Campos opcionales que SÍ acepta tu backend */}
          <div className="border-t pt-3">
            <h3 className="font-medium mb-2">Información adicional (opcional)</h3>
            
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
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCreateModal;