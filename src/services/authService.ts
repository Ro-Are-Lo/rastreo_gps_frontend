// src/services/authService.ts - VERSIÓN CORREGIDA
export async function login(username: string, password: string): Promise<any> {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error en login');
    }

    console.log('✅ Login exitoso:', data.usuario.username, 'roles:', data.usuario.roles);

    // 🔥 TRANSFORMAR DATOS para que coincidan con tu frontend
    const usuarioTransformado = {
      id: data.usuario.id,
      username: data.usuario.username,
      roles: data.usuario.roles,
      persona: {
        id: data.usuario.persona.id,
        nombre: data.usuario.persona.nombre,
        apellido_paterno: data.usuario.persona.apellido_paterno,
        apellido_materno: data.usuario.persona.apellido_materno,
        genero: data.usuario.persona.genero,
        foto_url: data.usuario.persona.foto_url,
      }
    };

    return {
      success: data.success,
      token: data.token,
      usuario: usuarioTransformado // ✅ Usar la versión transformada
    };
  } catch (error: any) {
    console.error('🔥 Error en login:', error);
    throw error;
  }
}