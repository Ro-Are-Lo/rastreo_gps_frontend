// src/models/User.ts
// Definición de los tipos de datos usados en el login
// aqui se definira el modelo de usuario lo que mostrara y se usara del json que nos da el backend
// src/models/User.ts
export interface User {
  usuario_id: number;
  username: string;
  nombre: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  cedula_identidad: string;
  nacionalidad?: string;
  genero?: string;
  licencia_numero?: string;
  licencia_categoria?: string;
  foto_url?: string;
  roles?: Array<{
    rol: {
      nombre: string;
    };
  }>;
}

export interface LoginResponse {
  usuario: User;
  token: string;
  refreshToken: string;
}

