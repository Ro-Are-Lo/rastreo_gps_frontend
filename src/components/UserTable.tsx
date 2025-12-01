// src/components/UserTable.tsx
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
    if (typeof role === "string") return role;
    if (role?.rol?.nombre) return role.rol.nombre;
    return "Sin rol";
  };

  // Verificar si el usuario actual es admin
  const isAdmin = currentUser?.roles?.some((r) => getRoleName(r) === "admin");

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
          {usuarios.map((user, index) => (
            <tr
              key={user.usuario_id}
              className="hover:bg-gray-100 transition-colors text-gray-700"
            >
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">
                {user.nombre} {user.apellido_paterno}
              </td>
              <td className="px-4 py-2 border">{user.username}</td>
              <td className="px-4 py-2 border">
                {user.roles?.map(getRoleName).join(", ") || "Sin rol"}
              </td>
              <td className="px-4 py-2 border text-center">
                <div className="flex justify-center space-x-3">
                 
                 
                  {/* Ver */}
                  <button
                    title="Ver"
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 shadow-md transition-transform transform hover:scale-110"
                    onClick={() => onView(user)}
                  >
                    <FaEye size={16} />
                  </button>

                  {/* Solo Admin puede Editar o Eliminar */}
                  {isAdmin && (
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
                        onClick={() => onDelete(user.usuario_id)}
                      >
                        <FaTrash size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
