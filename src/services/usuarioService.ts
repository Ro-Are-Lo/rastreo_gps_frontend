// src/services/usuarioService.ts - VERSIÓN CORRECTA
import api from "../api/api";

export const createUsuario = async (userData: any): Promise<any> => {
  try {
    // ✅ SOLO campos que tu backend ACEPTA según tus tests
    const payload = {
      nombre: userData.nombre?.trim(),
      apellido_paterno: userData.apellido_paterno?.trim(),
      apellido_materno: userData.apellido_materno?.trim() || undefined,
      genero: userData.genero || "M",
      foto_url: userData.foto_url?.trim() || undefined,
      username: userData.username?.trim(),
      password: userData.password,
      roles: userData.roles || ["CONDUCTOR"], // REQUERIDO como array
      
      // ✅ Solo estos campos opcionales:
      email: userData.email?.trim() || undefined,
      telefono: userData.telefono?.trim() || undefined,
      cedula_identidad: userData.cedula_identidad?.trim() || undefined,
      
      // ❌ NO incluir estos:
      // nacionalidad: userData.nacionalidad, ← NO
      // licencia_numero: userData.licencia_numero, ← NO
      // licencia_categoria: userData.licencia_categoria ← NO
    };

    // // Limpiar campos undefined
    // Object.keys(payload).forEach(key => {
    //   if (payload[key] === undefined || payload[key] === "") {
    //     delete payload[key];
    //   }
    // });

    console.log("📤 Enviando payload al backend:", payload);
    
    const { data } = await api.post("/usuarios-completos", payload);
    return data;
  } catch (error: any) {
    console.error("❌ Error creando usuario:", error.response?.data);
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      "Error al crear usuario"
    );
  }
};

export const updateUsuario = async (id: number, userData: any): Promise<any> => {
  try {
    // ✅ Mismos campos que create
    const payload = {
      nombre: userData.nombre,
      apellido_paterno: userData.apellido_paterno,
      apellido_materno: userData.apellido_materno,
      genero: userData.genero,
      foto_url: userData.foto_url,
      username: userData.username,
      ...(userData.password && { password: userData.password }),
      roles: userData.roles || ["CONDUCTOR"],
      
      // ✅ Solo estos campos:
      email: userData.email,
      telefono: userData.telefono,
      cedula_identidad: userData.cedula_identidad,
    };

    // Limpiar campos undefined
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === "") {
        delete payload[key];
      }
    });

    const { data } = await api.put(`/usuarios-completos/${id}`, payload);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Error al actualizar usuario");
  }
};

// Obtener todos los usuarios
export const getUsuarios = async (): Promise<any[]> => {
  try {
    console.log('📡 [getUsuarios] Iniciando petición...');
    
    const response = await api.get("/usuarios-completos");
    console.log('📡 [getUsuarios] Respuesta recibida:', response);
    
    // 🔥 CORRECCIÓN: Verificar estructura real
    const responseData = response.data;
    
    if (responseData.data) {
      // Si tiene propiedad "data" (ej: { data: [...], count: X })
      console.log(`✅ [getUsuarios] ${responseData.data.length} usuarios cargados`);
      return responseData.data;
    } else if (Array.isArray(responseData)) {
      // Si la respuesta es directamente un array
      console.log(`✅ [getUsuarios] ${responseData.length} usuarios cargados (array directo)`);
      return responseData;
    } else {
      // Si es otro formato
      console.warn('⚠️ [getUsuarios] Formato inesperado:', responseData);
      return [];
    }
    
  } catch (error: any) {
    console.error('🔥 [getUsuarios] Error completo:', error);
    
    // 🔥 MEJOR MENSAJE DE ERROR
    const errorMessage = 
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Error al obtener usuarios";
    
    console.error(`🔥 [getUsuarios] Error: ${errorMessage}`);
    throw new Error(errorMessage);
  }
};

// Obtener usuario por ID
export const getUsuarioById = async (id: number): Promise<any> => {
  try {
    const { data } = await api.get(`/usuarios-completos/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || "Error al obtener usuario");
  }
};

// Eliminar usuario
export const deleteUsuario = async (id: number): Promise<void> => {
  try {
    await api.delete(`/usuarios-completos/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Error al eliminar usuario");
  }
};