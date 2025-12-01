// src/controllers/usuarioController.ts
import * as usuarioService from '../services/usuarioService';
import type { User } from '../models/User';

export const usuarioController = {
  obtenerUsuarios: async (setUsuarios: (u: User[]) => void, setCargando: (c: boolean) => void) => {
    setCargando(true);
    try {
      const data = await usuarioService.getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    } finally {
      setCargando(false);
    }
  },

  eliminarUsuario: async (id: number, recargar: () => void) => {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      await usuarioService.deleteUsuario(id);
      recargar();
    }
  },
};
