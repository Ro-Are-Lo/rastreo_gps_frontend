// src/pages/UsersPage.tsx - VERSIÓN SIMPLIFICADA
import { useEffect, useState } from 'react';
import type { User } from '../models/User';
import { getUsuarios, deleteUsuario } from '../services/usuarioService';
import UserCreateModal from '../components/UserCreateModal';
import UserEditModal from '../components/UserEditModal';
import UserViewModal from '../components/UserViewModal'; // Si existe

const UsersPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
      alert('Error al cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleCreate = (usuario: User) => {
    setUsuarios(prev => [...prev, usuario]);
  };

  const handleEdit = (usuario: User) => {
    setUsuarios(prev =>
      prev.map(u => (u.usuario_id === usuario.usuario_id ? usuario : u))
    );
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro quieres eliminar este usuario?')) return;
    try {
      await deleteUsuario(id);
      setUsuarios(prev => prev.filter(u => u.usuario_id !== id));
    } catch (error) {
      console.error(error);
      alert('Error al eliminar usuario.');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          onClick={() => setCreateModalOpen(true)}
        >
          Crear Usuario
        </button>
      </div>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Usuario</th>
              <th className="border p-2">Roles</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(user => (
              <tr key={user.usuario_id}>
                <td className="border p-2">{user.usuario_id}</td>
                <td className="border p-2">{user.nombre} {user.apellido_paterno}</td>
                <td className="border p-2">{user.username}</td>
                <td className="border p-2">{user.roles?.join(', ')}</td>
                <td className="border p-2 space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedUser(user);
                      setViewModalOpen(true);
                    }}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Ver
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedUser(user);
                      setEditModalOpen(true);
                    }}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => user.usuario_id && handleDelete(user.usuario_id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {viewModalOpen && selectedUser && (
        <UserViewModal
          usuario={selectedUser}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      {createModalOpen && (
        <UserCreateModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreate}
        />
      )}

      {editModalOpen && selectedUser && (
        <UserEditModal
          usuario={selectedUser}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedUser(null);
          }}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default UsersPage;