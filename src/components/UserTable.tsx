// src/components/UserTable.tsx - VERSIÓN CORREGIDA
import React from "react";
import type { User } from "../models/User";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

interface Props {
  usuarios: User[];
  onEdit: (usuario: User) => void;
  onDelete: (usuario_id: number) => void;
  onView: (usuario: User) => void;
}

const UserTable: React.FC<Props> = ({ usuarios, onEdit, onDelete, onView }) => {
  const { user: currentUser } = useAuth();

  //Función auxiliar para obtener el nombre de rol
  const getRoleName = (role: any) => {
    if (typeof role === "string") return role.toUpperCase(); // 🔥 CONVERTIR A MAYÚSCULAS
    if (role?.rol?.nombre) return role.rol.nombre.toUpperCase();
    return "SIN ROL";
  };

  // 🔥 🔥 🔥 CORRECCIÓN CRÍTICA: Verificar ADMIN correctamente
  const isAdmin = currentUser?.roles?.some((r: any) => {
    const roleName = getRoleName(r);
    return roleName === "ADMIN";
  });

  // 🔥 DEBUG: Verificar en consola
  React.useEffect(() => {
    console.log("🔍 DEBUG UserTable:", {
      currentUserRoles: currentUser?.roles,
      isAdmin,
      userCount: usuarios.length
    });
  }, [currentUser?.roles, isAdmin, usuarios.length]);

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full border border-gray-300 bg-white rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-800 text-sm uppercase text-left">
            <th className="px-4 py-2 border">Num</th>
            <th className="px-4 py-2 border">Nombre</th>
            <th className="px-4 py-2 border">Usuario</th>
            <th className="px-4 py-2 border">Roles</th>
            <th className="px-4 py-2 border text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user, index) => {
            // 🔥 Verificar si este usuario es el usuario actual
            const isCurrentUser = currentUser?.username === user.username;
            
            return (
              <tr
                key={user.usuario_id}
                className={`hover:bg-gray-100 transition-colors text-gray-700 ${
                  isCurrentUser ? 'bg-yellow-50' : ''
                }`}
              >
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">
                  {user.nombre} {user.apellido_paterno}
                  {isCurrentUser && <span className="ml-2 text-xs bg-yellow-200 px-2 py-1 rounded">(Tú)</span>}
                </td>
                <td className="px-4 py-2 border">{user.username}</td>
                <td className="px-4 py-2 border">
                  {user.roles?.map(getRoleName).join(", ") || "Sin rol"}
                </td>
                <td className="px-4 py-2 border text-center">
                  <div className="flex justify-center space-x-3">
                    {/* Ver - TODOS pueden ver */}
                    <button
                      title="Ver"
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 shadow-md transition-transform transform hover:scale-110"
                      onClick={() => onView(user)}
                    >
                      <FaEye size={16} />
                    </button>

                    {/* 🔥 CORREGIDO: Solo Admin puede Editar o Eliminar (excepto a sí mismo) */}
                    {isAdmin && !isCurrentUser && (
                      <>
                        <button
                          title="Editar"
                          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-md transition-transform transform hover:scale-110"
                          onClick={() => onEdit(user)}
                        >
                          <FaEdit size={16} />
                        </button>

                        <button
                          title="Eliminar"
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition-transform transform hover:scale-110"
                          onClick={() => onDelete(user.usuario_id || user.id || 0)}
                        >
                          <FaTrash size={16} />
                        </button>
                      </>
                    )}
                    
                    {/* 🔥 Si es ADMIN pero es él mismo, mostrar mensaje */}
                    {isAdmin && isCurrentUser && (
                      <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                        Tu usuario
                      </span>
                    )}
                    
                    {/* 🔥 DEBUG: Mostrar si no es admin */}
                    {!isAdmin && (
                      <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                        Solo lectura
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;