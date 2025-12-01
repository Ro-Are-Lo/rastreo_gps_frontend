// rastreo_gps_frontend/src/types/permisos.ts
export type Role = "admin" | "conductor" | "usuario";

export interface ViewPermission {
  name: string;
  key: string;
  rolesAllowed: Role[];
}

export const viewsPermissions: ViewPermission[] = [
  { name: "Usuarios", key: "usuarios", rolesAllowed: ["admin"] },
  { name: "Conductor", key: "conductor", rolesAllowed: ["conductor"] },
  { name: "Vehículos", key: "vehiculos", rolesAllowed: ["admin", "conductor", "usuario"] },
  { name: "Configuración", key: "configuracion", rolesAllowed: ["admin"] },
  { name: "Mapa", key: "mapa", rolesAllowed: ["admin", "conductor", "usuario"] },
];
