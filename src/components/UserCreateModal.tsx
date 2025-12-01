import React, { useEffect, useState } from 'react';
import { createUsuario } from '../services/usuarioService';
import { User } from '../models/User';

interface Props {
  onClose: () => void;
  onCreate: (user: User) => void;
}

const UserCreateModal: React.FC<Props> = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    username: '',
    cedula_identidad: '',
    nacionalidad: '',
    genero: '',
    licencia_numero: '',
    licencia_categoria: '',
    foto_url: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔹 Desactivar scroll y menú al abrir el modal
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open'); // opcional: útil si quieres ocultar el menú lateral por CSS
    return () => {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('modal-open');
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    switch (name) {
      case 'nombre':
      case 'apellido_paterno':
      case 'apellido_materno':
      case 'nacionalidad':
        newValue = value.replace(/[^a-zA-Z\s]/g, '');
        break;

      case 'username':
        newValue = value.replace(/[^a-zA-Z0-9_]/g, '');
        break;

      case 'cedula_identidad':
      case 'licencia_numero':
        newValue = value.replace(/[^0-9]/g, '');
        break;

      case 'licencia_categoria':
        newValue = value.replace(/[^A-C]/g, '');
        break;
    }

    setForm({ ...form, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const newUser = await createUsuario({
        username: form.username,
        password: form.password,
        nombre: form.nombre,
        apellido_paterno: form.apellido_paterno,
        apellido_materno: form.apellido_materno,
        cedula_identidad: form.cedula_identidad,
        nacionalidad: form.nacionalidad,
        genero: form.genero,
        licencia_numero: form.licencia_numero,
        licencia_categoria: form.licencia_categoria,
        foto_url: form.foto_url,
      });
      onCreate(newUser);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🔹 z-[2000] asegura que está por encima del menú (que tiene z-[1100])
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-lg p-6 w-[480px] shadow-2xl overflow-y-auto max-h-[90vh] relative">
        {/* Botón de cerrar arriba a la derecha */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Crear Usuario</h2>

        <form onSubmit={handleSubmit} className="space-y-2">
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          <input name="apellido_paterno" placeholder="Apellido Paterno" value={form.apellido_paterno} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          <input name="apellido_materno" placeholder="Apellido Materno" value={form.apellido_materno} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          <input name="username" placeholder="Usuario" value={form.username} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          <input name="cedula_identidad" placeholder="Cédula de Identidad" value={form.cedula_identidad} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          <input name="nacionalidad" placeholder="Nacionalidad" value={form.nacionalidad} onChange={handleChange} className="w-full px-3 py-2 border rounded" />

          <select name="genero" value={form.genero} onChange={handleChange} className="w-full px-3 py-2 border rounded">
            <option value="">Seleccionar Género</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>

          <input name="licencia_numero" placeholder="Número de Licencia" value={form.licencia_numero} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          <input name="licencia_categoria" placeholder="Categoría de Licencia (A, B o C)" value={form.licencia_categoria} onChange={handleChange} className="w-full px-3 py-2 border rounded" />

          <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} className="w-full px-3 py-2 border rounded" />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex justify-end space-x-2 mt-4">
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
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              {loading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCreateModal;
