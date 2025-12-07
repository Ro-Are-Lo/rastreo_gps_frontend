// src/types/permisos.ts
export type Role = 'ADMIN' | 'CONDUCTOR' | 'SUPERVISOR';

export interface ViewPermission {
  key: string;
  name: string;
  rolesAllowed: Role[];
}

export const viewsPermissions: ViewPermission[] = [
  {
    key: 'mapa',
    name: 'Mapa',
    rolesAllowed: ['ADMIN', 'CONDUCTOR', 'SUPERVISOR'],
  },
  {
    key: 'usuarios',
    name: 'Usuarios',
    rolesAllowed: ['ADMIN'],
  },
  {
    key: 'vehiculos',
    name: 'Vehículos',
    rolesAllowed: ['ADMIN', 'SUPERVISOR'],
  },
  {
    key: 'rutas',
    name: 'Rutas',
    rolesAllowed: ['ADMIN', 'SUPERVISOR'],
  },
  {
    key: 'reportes',
    name: 'Reportes',
    rolesAllowed: ['ADMIN'],
  },
  {
    key: 'configuracion',
    name: 'Configuración',
    rolesAllowed: ['ADMIN'],
  },
];