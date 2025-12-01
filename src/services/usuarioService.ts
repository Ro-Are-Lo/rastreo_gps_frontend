// src/services/usuarioService.ts
import api from '../api/api';
import type { User } from '../models/User';

export const getUsuarios = async (): Promise<User[]> => {
  try {
    const { data } = await api.get('/usuarios');
    // Asegúrate de devolver el array real:
    return Array.isArray(data) ? data : data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al obtener usuarios');
  }
};

export const getUsuarioById = async (id: number): Promise<User> => {
  try {
    const { data } = await api.get(`/usuarios/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al obtener usuario');
  }
};

export const createUsuario = async (user: Partial<User> & { password: string }): Promise<User> => {
  try {
    const { data } = await api.post('/usuarios', user);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al crear usuario');
  }
};

export const updateUsuario = async (id: number, user: Partial<User>): Promise<User> => {
  try {
    const { data } = await api.put(`/usuarios/${id}`, user);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al actualizar usuario');
  }
};

export const deleteUsuario = async (id: number): Promise<void> => {
  try {
    await api.delete(`/usuarios/${id}`);
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error al eliminar usuario');
  }
};
