// src/models/User.ts
export interface User {
  usuario_id?: number;
  id?: number;  // Tu backend usa 'id' no 'usuario_id'
  username: string;
  nombre: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  cedula_identidad?: string;
  nacionalidad?: string;
  genero?: string;
  licencia_numero?: string;
  licencia_categoria?: string;
  foto_url?: string;
  // 🔥 CAMBIO IMPORTANTE: Tu backend devuelve array de strings
  roles: string[]; // ['ADMIN', 'CONDUCTOR', 'SUPERVISOR']
  persona?: {
    id: number;
    nombre: string;
    apellido_paterno: string;
    apellido_materno?: string;
    genero?: string;
    foto_url?: string;
  };
    
  // Campos opcionales de respuesta
  contactos?: Array<{
    id: number;
    tipo: string;
    valor: string;
  }>;
  
  documentos?: Array<{
    id: number;
    tipo: string;
    numero: string;
  }>;
};


export interface LoginResponse {
  usuario: {
    id: number;
    username: string;
    persona?: {
      id: number;
      nombre: string;
      apellido_paterno: string;
      apellido_materno?: string;
      genero?: string;
      foto_url?: string;
    };
    roles: string[];
  };
  token: string;
  refreshToken?: string;
  success: boolean;
}