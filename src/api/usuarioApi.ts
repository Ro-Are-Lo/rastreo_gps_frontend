// src/api/usuarioApi.ts
import api from './api';
import type { User } from '../models/User';

const API_URL = '/api/usuarios';

export const usuarioApi = {
  getAll: async (): Promise<User[]> => {
    const res = await api.get(API_URL);
    return res.data;
  },

  getById: async (id: number): Promise<User> => {
    const res = await api.get(`${API_URL}/${id}`);
    return res.data;
  },

  create: async (data: Omit<User, 'usuario_id'> & { password: string }): Promise<User> => {
    const res = await api.post(API_URL, data);
    return res.data;
  },

  update: async (id: number, data: Partial<User>): Promise<User> => {
    const res = await api.put(`${API_URL}/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const res = await api.delete(`${API_URL}/${id}`);
    return res.data;
  },
};
