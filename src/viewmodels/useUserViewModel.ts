// src/viewmodels/useUserViewModel.ts - VERSIÓN CORREGIDA DEFINITIVA
import { useState, useCallback } from 'react';
import type { User } from '../models/User';
import {
  getUsuarios,
  createUsuario,
  deleteUsuario,
  updateUsuario
} from '../services/usuarioService';

export const useUserViewModel = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchCount, setFetchCount] = useState<number>(0); // 🔥 Control de intentos

  // 🔥 🔥 🔥 USAR useCallback PARA EVITAR RERENDERS
  const fetchUsuarios = useCallback(async () => {
    // 🔥 Evitar múltiples llamadas simultáneas
    if (loading) {
      console.log('⚠️ Ya está cargando, ignorando llamada');
      return;
    }
    
    // 🔥 Limitar número de intentos (opcional)
    if (fetchCount >= 3) {
      console.log('🛑 Máximo de intentos alcanzado');
      return;
    }
    
    console.log('🔄 fetchUsuarios ejecutándose...');
    setLoading(true);
    setFetchCount(prev => prev + 1);
    
    try {
      const data = await getUsuarios();
      
      // 🔥 Transformar datos de tu backend
      const usuariosTransformados = data.map((u: any) => ({
        usuario_id: u.id,
        id: u.id,
        username: u.username,
        nombre: u.persona?.nombre || '',
        apellido_paterno: u.persona?.apellido_paterno || '',
        apellido_materno: u.persona?.apellido_materno,
        genero: u.persona?.genero,
        foto_url: u.persona?.foto_url,
        roles: u.roles || []
      }));
      
      setUsuarios(usuariosTransformados);
      console.log(`✅ ${usuariosTransformados.length} usuarios cargados`);
    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, fetchCount]); // 🔥 Dependencias importantes

  const addUsuario = async (nuevo: any) => {
    const user = await createUsuario(nuevo);
    const usuarioTransformado = {
      usuario_id: user.data?.usuario?.id,
      id: user.data?.usuario?.id,
      username: user.data?.usuario?.username,
      nombre: user.data?.persona?.nombre,
      apellido_paterno: user.data?.persona?.apellido_paterno,
      apellido_materno: user.data?.persona?.apellido_materno,
      genero: user.data?.persona?.genero,
      foto_url: user.data?.persona?.foto_url,
      roles: nuevo.roles
    };
    setUsuarios(prev => [...prev, usuarioTransformado]);
  };

  const removeUsuario = async (id: number) => {
    await deleteUsuario(id);
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  const editUsuario = async (id: number, data: any) => {
    const actualizado = await updateUsuario(id, data);
    const usuarioTransformado = {
      usuario_id: actualizado.id,
      id: actualizado.id,
      ...actualizado
    };
    setUsuarios(prev =>
      prev.map(u => (u.id === id ? usuarioTransformado : u))
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