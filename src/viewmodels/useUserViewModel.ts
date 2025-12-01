// src/viewmodels/useUserViewModel.ts
import { useState } from 'react';
import { User } from '../models/User';
import {
  getUsuarios,
  createUsuario,
  deleteUsuario,
  updateUsuario
} from '../services/usuarioService';

export const useUserViewModel = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const addUsuario = async (nuevo: Partial<User> & { password: string }) => {
    const user = await createUsuario(nuevo);
    setUsuarios(prev => [...prev, user]);
  };

  const removeUsuario = async (id: number) => {
    await deleteUsuario(id);
    setUsuarios(prev => prev.filter(u => u.usuario_id !== id));
  };

  const editUsuario = async (id: number, data: Partial<User>) => {
    const actualizado = await updateUsuario(id, data);
    setUsuarios(prev =>
      prev.map(u => (u.usuario_id === id ? actualizado : u))
    );
  };

  return {
    usuarios,
    loading,
    fetchUsuarios,
    addUsuario,
    removeUsuario,
    editUsuario,
  };
};
